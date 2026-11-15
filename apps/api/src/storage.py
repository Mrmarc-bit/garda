"""SQLite persistence: operators, sessions, and the tamper-evident audit ledger.

Design notes
------------
* The audit ledger is **append-only at the storage layer**: SQLite triggers
  reject every UPDATE and DELETE, so the application cannot rewrite history even
  by accident.
* Each entry is chained: ``entry_hash = HMAC-SHA256(key, prev_hash || canonical)``.
  The key lives outside the database (``.garda/audit-secret.key``), so an
  attacker who only gains database access cannot recompute a valid chain.
* ``verify_chain`` recomputes the whole chain and reports the first broken
  sequence number, which is what the ``/api/audit-trail/verify`` endpoint and the
  SEC-OT-05 safety invariant consume.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import secrets
import sqlite3
import threading
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

from . import config

_WRITE_LOCK = threading.Lock()
_SECRET_LOCK = threading.Lock()
_AUDIT_KEY: Optional[bytes] = None

_SCHEMA = """
CREATE TABLE IF NOT EXISTS operators (
    operator_id   TEXT PRIMARY KEY,
    display_name  TEXT NOT NULL,
    clearance     INTEGER NOT NULL,
    password_hash TEXT NOT NULL,
    is_synthetic  INTEGER NOT NULL DEFAULT 1,
    created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    token_hash  TEXT PRIMARY KEY,
    operator_id TEXT NOT NULL,
    created_at  TEXT NOT NULL,
    expires_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_entries (
    seq          INTEGER PRIMARY KEY AUTOINCREMENT,
    id           TEXT NOT NULL UNIQUE,
    timestamp    TEXT NOT NULL,
    actor        TEXT NOT NULL,
    event_type   TEXT NOT NULL,
    resource     TEXT NOT NULL,
    result       TEXT NOT NULL,
    details      TEXT NOT NULL,
    prev_hash    TEXT NOT NULL,
    entry_hash   TEXT NOT NULL,
    is_synthetic INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_entries(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);

CREATE TRIGGER IF NOT EXISTS audit_entries_no_update
BEFORE UPDATE ON audit_entries
BEGIN
    SELECT RAISE(ABORT, 'audit_entries is append-only: UPDATE rejected');
END;

CREATE TRIGGER IF NOT EXISTS audit_entries_no_delete
BEFORE DELETE ON audit_entries
BEGIN
    SELECT RAISE(ABORT, 'audit_entries is append-only: DELETE rejected');
END;
"""

GENESIS_HASH = "0" * 64


# --------------------------------------------------------------------------- #
# Connection handling
# --------------------------------------------------------------------------- #
def _connect() -> sqlite3.Connection:
    config.ensure_data_dir()
    conn = sqlite3.connect(config.DB_PATH, timeout=15.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.execute("PRAGMA busy_timeout=15000")
    return conn


def init_db() -> None:
    """Create the schema. Idempotent."""
    with _WRITE_LOCK:
        conn = _connect()
        try:
            conn.executescript(_SCHEMA)
            conn.commit()
        finally:
            conn.close()
    _harden_db_permissions()


def _harden_db_permissions() -> None:
    """Restrict the database file to the owning user.

    The data directory is already 0700, but defence in depth means the ledger
    file itself should not be world-readable if it is ever moved or the
    directory permissions are loosened.
    """
    for path in (config.DB_PATH, config.DB_PATH.with_name(config.DB_PATH.name + "-wal"),
                 config.DB_PATH.with_name(config.DB_PATH.name + "-shm")):
        if path.exists():
            try:
                os.chmod(path, 0o600)
            except OSError:  # pragma: no cover - best effort on exotic filesystems
                pass


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


# --------------------------------------------------------------------------- #
# Audit signing key
# --------------------------------------------------------------------------- #
def _audit_key() -> bytes:
    """Load the HMAC key from the environment or the private key file."""
    global _AUDIT_KEY
    if _AUDIT_KEY is not None:
        # Fail closed if the on-disk key no longer matches the cached one.
        # This happens when the data directory is replaced underneath a running
        # process: without this check the process would keep signing new entries
        # with a key the stored file no longer holds, so every entry it writes
        # would be unverifiable after a restart while the API kept reporting
        # success. Refusing to append is the honest outcome.
        if not os.getenv("GARDA_AUDIT_SECRET"):
            path = config.AUDIT_SECRET_PATH
            try:
                on_disk = path.read_bytes().strip()
            except OSError as exc:
                raise RuntimeError(
                    "The audit signing key is missing from disk. Stop the API and "
                    "restart it against the intended data directory."
                ) from exc
            if on_disk != _AUDIT_KEY:
                raise RuntimeError(
                    "The audit signing key on disk no longer matches the key this "
                    "process loaded. The ledger cannot be extended safely; stop the "
                    "API and restart it."
                )
        return _AUDIT_KEY

    with _SECRET_LOCK:
        if _AUDIT_KEY is not None:
            return _AUDIT_KEY

        env_key = os.getenv("GARDA_AUDIT_SECRET")
        if env_key:
            _AUDIT_KEY = env_key.encode("utf-8")
            return _AUDIT_KEY

        config.ensure_data_dir()
        path = config.AUDIT_SECRET_PATH
        if path.exists():
            _AUDIT_KEY = path.read_bytes().strip()
            return _AUDIT_KEY

        key = secrets.token_bytes(32)
        fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, "wb") as handle:
            handle.write(key)
        _AUDIT_KEY = key
        return _AUDIT_KEY


def _canonical_entry(entry: Dict[str, Any]) -> str:
    return json.dumps(entry, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def _entry_hash(prev_hash: str, entry: Dict[str, Any]) -> str:
    payload = f"{prev_hash}\n{_canonical_entry(entry)}".encode("utf-8")
    return hmac.new(_audit_key(), payload, hashlib.sha256).hexdigest()


# --------------------------------------------------------------------------- #
# Audit ledger
# --------------------------------------------------------------------------- #
def _tail_hash(conn: sqlite3.Connection) -> str:
    row = conn.execute(
        "SELECT entry_hash FROM audit_entries ORDER BY seq DESC LIMIT 1"
    ).fetchone()
    return row["entry_hash"] if row else GENESIS_HASH


def append_audit(
    *,
    actor: str,
    event_type: str,
    resource: str,
    result: str,
    details: str,
    is_synthetic: bool = False,
    entry_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Append one entry to the ledger, chained to the previous entry."""
    timestamp = _now()
    record = {
        "id": entry_id or f"AUD-{uuid.uuid4().hex[:10].upper()}",
        "timestamp": timestamp,
        "actor": actor,
        "event_type": event_type,
        "resource": resource,
        "result": result,
        "details": details,
    }

    with _WRITE_LOCK:
        conn = _connect()
        try:
            prev_hash = _tail_hash(conn)
            entry_hash = _entry_hash(prev_hash, record)
            conn.execute(
                """
                INSERT INTO audit_entries
                    (id, timestamp, actor, event_type, resource, result, details,
                     prev_hash, entry_hash, is_synthetic)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    record["id"],
                    record["timestamp"],
                    record["actor"],
                    record["event_type"],
                    record["resource"],
                    record["result"],
                    record["details"],
                    prev_hash,
                    entry_hash,
                    1 if is_synthetic else 0,
                ),
            )
            conn.commit()
        finally:
            conn.close()

    return {**record, "prev_hash": prev_hash, "entry_hash": entry_hash,
            "is_synthetic": is_synthetic}


def list_audit(limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    limit = max(1, min(limit, config.MAX_PAGE_SIZE))
    offset = max(0, offset)
    conn = _connect()
    try:
        rows = conn.execute(
            """
            SELECT seq, id, timestamp, actor, event_type, resource, result, details,
                   prev_hash, entry_hash, is_synthetic
            FROM audit_entries
            ORDER BY seq DESC
            LIMIT ? OFFSET ?
            """,
            (limit, offset),
        ).fetchall()
        return [
            {**dict(row), "is_synthetic": bool(row["is_synthetic"])} for row in rows
        ]
    finally:
        conn.close()


def count_audit() -> int:
    conn = _connect()
    try:
        return int(conn.execute("SELECT COUNT(*) AS n FROM audit_entries").fetchone()["n"])
    finally:
        conn.close()


def verify_chain() -> Tuple[bool, Optional[int], int]:
    """Recompute the full chain.

    Returns ``(ok, broken_seq, checked_count)``.
    """
    conn = _connect()
    try:
        rows = conn.execute(
            """
            SELECT seq, id, timestamp, actor, event_type, resource, result,
                   details, prev_hash, entry_hash
            FROM audit_entries
            ORDER BY seq ASC
            """
        ).fetchall()
    finally:
        conn.close()

    expected_prev = GENESIS_HASH
    for row in rows:
        record = {
            "id": row["id"],
            "timestamp": row["timestamp"],
            "actor": row["actor"],
            "event_type": row["event_type"],
            "resource": row["resource"],
            "result": row["result"],
            "details": row["details"],
        }
        if not hmac.compare_digest(row["prev_hash"], expected_prev):
            return False, int(row["seq"]), len(rows)
        recomputed = _entry_hash(row["prev_hash"], record)
        if not hmac.compare_digest(row["entry_hash"], recomputed):
            return False, int(row["seq"]), len(rows)
        expected_prev = row["entry_hash"]

    return True, None, len(rows)


# --------------------------------------------------------------------------- #
# Operators
# --------------------------------------------------------------------------- #
def get_operator(operator_id: str) -> Optional[Dict[str, Any]]:
    conn = _connect()
    try:
        row = conn.execute(
            "SELECT operator_id, display_name, clearance, password_hash, is_synthetic "
            "FROM operators WHERE operator_id = ?",
            (operator_id,),
        ).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def upsert_operator(
    operator_id: str,
    display_name: str,
    clearance: int,
    password_hash: str,
    is_synthetic: bool = True,
) -> None:
    with _WRITE_LOCK:
        conn = _connect()
        try:
            conn.execute(
                """
                INSERT INTO operators
                    (operator_id, display_name, clearance, password_hash,
                     is_synthetic, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(operator_id) DO UPDATE SET
                    display_name = excluded.display_name,
                    clearance = excluded.clearance,
                    password_hash = excluded.password_hash
                """,
                (
                    operator_id,
                    display_name,
                    clearance,
                    password_hash,
                    1 if is_synthetic else 0,
                    _now(),
                ),
            )
            conn.commit()
        finally:
            conn.close()


def count_operators() -> int:
    conn = _connect()
    try:
        return int(conn.execute("SELECT COUNT(*) AS n FROM operators").fetchone()["n"])
    finally:
        conn.close()


# --------------------------------------------------------------------------- #
# Sessions
# --------------------------------------------------------------------------- #
def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_session(operator_id: str) -> Tuple[str, str]:
    """Create a session and return ``(plaintext_token, expires_at_iso)``.

    Only the SHA-256 of the token is stored, so a database leak does not hand an
    attacker live sessions.
    """
    token = secrets.token_urlsafe(32)
    created = datetime.now(timezone.utc)
    expires = created + timedelta(minutes=config.SESSION_TTL_MINUTES)

    with _WRITE_LOCK:
        conn = _connect()
        try:
            conn.execute(
                "INSERT INTO sessions (token_hash, operator_id, created_at, expires_at) "
                "VALUES (?, ?, ?, ?)",
                (_token_hash(token), operator_id, created.isoformat(), expires.isoformat()),
            )
            conn.commit()
        finally:
            conn.close()

    return token, expires.isoformat()


def resolve_session(token: Optional[str]) -> Optional[Dict[str, Any]]:
    if not token:
        return None

    conn = _connect()
    try:
        row = conn.execute(
            """
            SELECT s.token_hash, s.expires_at, o.operator_id, o.display_name,
                   o.clearance, o.is_synthetic
            FROM sessions s
            JOIN operators o ON o.operator_id = s.operator_id
            WHERE s.token_hash = ?
            """,
            (_token_hash(token),),
        ).fetchone()
    finally:
        conn.close()

    if row is None:
        return None

    try:
        expires = datetime.fromisoformat(row["expires_at"])
    except ValueError:
        return None

    if expires <= datetime.now(timezone.utc):
        revoke_session(token)
        return None

    return {
        "operator_id": row["operator_id"],
        "display_name": row["display_name"],
        "clearance": int(row["clearance"]),
        "is_synthetic": bool(row["is_synthetic"]),
        "expires_at": row["expires_at"],
    }


def revoke_session(token: Optional[str]) -> None:
    if not token:
        return
    with _WRITE_LOCK:
        conn = _connect()
        try:
            conn.execute("DELETE FROM sessions WHERE token_hash = ?", (_token_hash(token),))
            conn.commit()
        finally:
            conn.close()


def purge_expired_sessions() -> int:
    with _WRITE_LOCK:
        conn = _connect()
        try:
            cursor = conn.execute(
                "DELETE FROM sessions WHERE expires_at <= ?",
                (datetime.now(timezone.utc).isoformat(),),
            )
            conn.commit()
            return int(cursor.rowcount or 0)
        finally:
            conn.close()
