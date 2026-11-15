"""Authentication, authorization, and abuse-control primitives.

Sessions are opaque random tokens delivered in an ``HttpOnly`` cookie and
resolved server-side on every request. Nothing about identity is taken from the
request body, which is what previously allowed any caller to self-certify as an
analyst.
"""

from __future__ import annotations

import hashlib
import hmac
import logging
import os
import secrets
import threading
import time
from typing import Dict, Optional, Tuple

from fastapi import Depends, HTTPException, Request, status

from . import config, storage

logger = logging.getLogger("garda.security")

_PBKDF2_SCHEME = "pbkdf2_sha256"


# --------------------------------------------------------------------------- #
# Password hashing (stdlib only, no extra dependency)
# --------------------------------------------------------------------------- #
def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, config.PBKDF2_ITERATIONS
    )
    return f"{_PBKDF2_SCHEME}${config.PBKDF2_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        scheme, iterations, salt_hex, digest_hex = encoded.split("$")
        if scheme != _PBKDF2_SCHEME:
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), bytes.fromhex(salt_hex), int(iterations)
        )
    except (ValueError, TypeError):
        return False
    return hmac.compare_digest(digest.hex(), digest_hex)


# --------------------------------------------------------------------------- #
# Bootstrap of the synthetic operator registry
# --------------------------------------------------------------------------- #
DEMO_OPERATORS: Tuple[Tuple[str, str, int], ...] = (
    ("analyst-demo-03", "Nadia Rahman", 2),
    ("analyst-demo-01", "Rizky Pratama", 3),
    ("auditor-demo-02", "Sari Wulandari", 3),
)


def bootstrap_operators() -> Optional[str]:
    """Seed demo operators on first boot.

    Returns the path of the generated credentials file when a password had to be
    generated, otherwise ``None``. Production refuses to fall back to a generated
    password: it must be supplied explicitly.
    """
    if storage.count_operators() > 0:
        return None

    password = os.getenv("GARDA_DEMO_PASSWORD")
    generated = False

    if not password:
        if config.IS_PRODUCTION:
            raise RuntimeError(
                "GARDA_DEMO_PASSWORD must be set when GARDA_ENV=production; "
                "refusing to generate a bootstrap credential in production."
            )
        password = secrets.token_urlsafe(18)
        generated = True

    for operator_id, display_name, clearance in DEMO_OPERATORS:
        storage.upsert_operator(
            operator_id=operator_id,
            display_name=display_name,
            clearance=clearance,
            password_hash=hash_password(password),
        )

    if not generated:
        logger.info("Seeded %d synthetic operators from GARDA_DEMO_PASSWORD.", len(DEMO_OPERATORS))
        return None

    config.ensure_data_dir()
    path = config.BOOTSTRAP_CREDENTIALS_PATH
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as handle:
        handle.write(
            "# GARDA-SIM synthetic demo credentials (generated on first boot)\n"
            "# This file is git-ignored. Delete it after setting GARDA_DEMO_PASSWORD.\n"
        )
        for operator_id, display_name, clearance in DEMO_OPERATORS:
            handle.write(f"{operator_id}\t{display_name}\tL{clearance}\t{password}\n")

    logger.warning(
        "Generated synthetic demo credentials at %s. Set GARDA_DEMO_PASSWORD to control it.",
        path,
    )
    return str(path)


def read_bootstrap_password() -> Optional[str]:
    """Return the generated demo password, for the local demo sign-in hint.

    Only available outside production and only when the password was *generated*
    (that is, when it is already sitting in a 0600 file on this machine). An
    explicitly configured ``GARDA_DEMO_PASSWORD`` is never echoed back.
    """
    if config.IS_PRODUCTION:
        return None
    path = config.BOOTSTRAP_CREDENTIALS_PATH
    try:
        for line in path.read_text(encoding="utf-8").splitlines():
            if not line or line.startswith("#"):
                continue
            parts = line.split("\t")
            if len(parts) == 4:
                return parts[3]
    except OSError:
        return None
    return None


# --------------------------------------------------------------------------- #
# Session cookies
# --------------------------------------------------------------------------- #
def set_session_cookie(response, token: str, expires_at: str) -> None:
    max_age = max(0, int(config.SESSION_TTL_MINUTES * 60))
    response.set_cookie(
        key=config.SESSION_COOKIE_NAME,
        value=token,
        max_age=max_age,
        httponly=True,
        secure=config.SESSION_COOKIE_SECURE,
        samesite="lax",
        path="/",
    )


def clear_session_cookie(response) -> None:
    response.delete_cookie(
        key=config.SESSION_COOKIE_NAME,
        path="/",
        httponly=True,
        secure=config.SESSION_COOKIE_SECURE,
        samesite="lax",
    )


def current_session(request: Request) -> Optional[Dict]:
    token = request.cookies.get(config.SESSION_COOKIE_NAME)
    return storage.resolve_session(token)


def require_session(request: Request) -> Dict:
    """FastAPI dependency: every protected route resolves the caller here."""
    session = current_session(request)
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={"WWW-Authenticate": "Cookie"},
        )
    return session


def require_clearance(session: Dict = Depends(require_session)) -> Dict:
    """Require the minimum clearance for a safety-relevant action."""
    if int(session.get("clearance", 0)) < config.MIN_OPERATOR_CLEARANCE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                f"Operator clearance L{session.get('clearance')} is below the "
                f"required L{config.MIN_OPERATOR_CLEARANCE} for this action."
            ),
        )
    return session


# --------------------------------------------------------------------------- #
# CSRF: same-site cookie + Origin allow-list on mutating requests
# --------------------------------------------------------------------------- #
def require_trusted_origin(request: Request) -> None:
    """Reject state-changing requests that did not originate from the app.

    ``SameSite=Lax`` already blocks cross-site POSTs from a browser, but an
    explicit Origin check keeps the guarantee visible and covers clients that
    ignore the attribute.
    """
    origin = request.headers.get("origin")
    if origin is None:
        # Non-browser clients (curl, tests, server-to-server) send no Origin.
        return
    if origin in config.ALLOWED_ORIGINS:
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Request origin is not allowed.",
    )


# --------------------------------------------------------------------------- #
# Rate limiting (fixed window, per client + route)
# --------------------------------------------------------------------------- #
class _RateLimiter:
    def __init__(self) -> None:
        self._hits: Dict[str, Tuple[int, float]] = {}
        self._lock = threading.Lock()

    def check(self, key: str) -> None:
        now = time.monotonic()
        window = config.RATE_LIMIT_WINDOW_SECONDS
        with self._lock:
            count, window_start = self._hits.get(key, (0, now))
            if now - window_start >= window:
                count, window_start = 0, now
            count += 1
            self._hits[key] = (count, window_start)

            # Opportunistic cleanup so the map cannot grow without bound.
            if len(self._hits) > 4096:
                self._hits = {
                    k: v for k, v in self._hits.items() if now - v[1] < window
                }

        if count > config.RATE_LIMIT_MAX_REQUESTS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Retry later.",
                headers={"Retry-After": str(window)},
            )


limiter = _RateLimiter()


def rate_limit(scope: str):
    """Dependency factory: ``Depends(rate_limit("simulate"))``."""

    def _dependency(request: Request) -> None:
        client = request.client.host if request.client else "unknown"
        limiter.check(f"{scope}:{client}")

    return _dependency
