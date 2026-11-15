"""Storage-layer tests: append-only enforcement, chain integrity, session handling."""

import pytest
from fastapi import HTTPException

from apps.api.src import config, security, storage


def test_ledger_rejects_update():
    """The append-only guarantee must come from the database, not convention."""
    storage.append_audit(
        actor="test-actor",
        event_type="TEST_EVENT",
        resource="TEST",
        result="SUCCESS",
        details="immutability probe",
        is_synthetic=True,
    )
    conn = storage._connect()
    try:
        with pytest.raises(Exception) as excinfo:
            conn.execute("UPDATE audit_entries SET result = 'TAMPERED'")
        assert "append-only" in str(excinfo.value).lower()
    finally:
        conn.close()


def test_ledger_rejects_delete():
    conn = storage._connect()
    try:
        with pytest.raises(Exception) as excinfo:
            conn.execute("DELETE FROM audit_entries")
        assert "append-only" in str(excinfo.value).lower()
    finally:
        conn.close()


def test_chain_detects_a_rewritten_entry():
    """With the trigger removed, an edit must still be caught by the chain."""
    entry = storage.append_audit(
        actor="test-actor",
        event_type="TEST_EVENT",
        resource="TAMPER-PROBE",
        result="SUCCESS",
        details="original details",
        is_synthetic=True,
    )
    assert storage.verify_chain()[0] is True

    conn = storage._connect()
    try:
        conn.execute("DROP TRIGGER audit_entries_no_update")
        conn.execute(
            "UPDATE audit_entries SET details = ? WHERE id = ?",
            ("rewritten details", entry["id"]),
        )
        conn.commit()
    finally:
        conn.close()

    ok, broken_seq, _checked = storage.verify_chain()
    assert ok is False
    assert broken_seq is not None

    # Restore the guard for the rest of the session.
    storage.init_db()


def test_session_tokens_are_not_stored_in_plaintext():
    token, expires_at = storage.create_session("analyst-demo-03")
    assert expires_at
    conn = storage._connect()
    try:
        rows = conn.execute("SELECT token_hash FROM sessions").fetchall()
    finally:
        conn.close()
    stored = {row["token_hash"] for row in rows}
    assert token not in stored
    assert any(len(value) == 64 for value in stored)


def test_expired_session_is_not_resolved():
    token, _ = storage.create_session("analyst-demo-03")
    conn = storage._connect()
    try:
        conn.execute(
            "UPDATE sessions SET expires_at = ? WHERE token_hash = ?",
            ("2000-01-01T00:00:00+00:00", storage._token_hash(token)),
        )
        conn.commit()
    finally:
        conn.close()
    assert storage.resolve_session(token) is None


def test_revoked_session_is_not_resolved():
    token, _ = storage.create_session("analyst-demo-03")
    assert storage.resolve_session(token) is not None
    storage.revoke_session(token)
    assert storage.resolve_session(token) is None


def test_password_hash_roundtrip():
    encoded = security.hash_password("correct horse battery staple")
    assert security.verify_password("correct horse battery staple", encoded)
    assert not security.verify_password("wrong", encoded)
    assert not security.verify_password("anything", "not-a-valid-hash")


def test_rate_limiter_trips_after_the_budget(monkeypatch):
    monkeypatch.setattr(config, "RATE_LIMIT_MAX_REQUESTS", 2)
    monkeypatch.setattr(config, "RATE_LIMIT_WINDOW_SECONDS", 60)
    limiter = security._RateLimiter()
    limiter.check("probe:127.0.0.1")
    limiter.check("probe:127.0.0.1")
    with pytest.raises(HTTPException) as excinfo:
        limiter.check("probe:127.0.0.1")
    assert excinfo.value.status_code == 429
    assert "Retry-After" in excinfo.value.headers


def test_rate_limiter_is_per_client():
    limiter = security._RateLimiter()
    for _ in range(config.RATE_LIMIT_MAX_REQUESTS):
        limiter.check("probe:client-a")
    limiter.check("probe:client-b")  # a different client is unaffected

def test_replaced_key_file_blocks_further_appends(monkeypatch, tmp_path):
    """If the key file is swapped under a running process, appends must fail closed.

    Without this the process keeps signing with the key it cached, so entries it
    writes look successful but can never be verified after a restart.
    """
    monkeypatch.setattr(storage, "_AUDIT_KEY", None)
    monkeypatch.delenv("GARDA_AUDIT_SECRET", raising=False)
    storage.append_audit(
        actor="analyst-demo-03",
        event_type="TEST_EVENT",
        resource="INC-2026-0042",
        result="RECORDED",
        details="signed with the original key",
    )
    # Replace the key file behind the process's back.
    monkeypatch.setattr(config, "AUDIT_SECRET_PATH", tmp_path / "other.key")
    (tmp_path / "other.key").write_bytes(b"a-completely-different-key-value")
    with pytest.raises(RuntimeError, match="no longer matches"):
        storage.append_audit(
            actor="analyst-demo-03",
            event_type="TEST_EVENT",
            resource="INC-2026-0042",
            result="RECORDED",
            details="must not be written",
        )
