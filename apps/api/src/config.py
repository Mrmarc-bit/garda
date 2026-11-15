"""Centralised environment configuration for the GARDA-SIM API.

No secrets are stored in source. The audit HMAC key and bootstrap credentials
are read from the environment or generated once into a git-ignored data
directory with restrictive permissions.
"""

import os
from pathlib import Path


def _env_bool(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def _env_int(name: str, default: int) -> int:
    raw = os.getenv(name)
    if raw is None:
        return default
    try:
        return int(raw)
    except ValueError:
        return default


_REPO_ROOT = Path(__file__).resolve().parents[3]

ENVIRONMENT: str = os.getenv("GARDA_ENV", "development").strip().lower()
IS_PRODUCTION: bool = ENVIRONMENT == "production"

DATA_DIR: Path = Path(os.getenv("GARDA_DATA_DIR", str(_REPO_ROOT / ".garda"))).resolve()
DB_PATH: Path = DATA_DIR / "garda.db"
AUDIT_SECRET_PATH: Path = DATA_DIR / "audit-secret.key"
BOOTSTRAP_CREDENTIALS_PATH: Path = DATA_DIR / "demo-credentials.txt"

# Session lifetime. Short enough to bound the blast radius of a stolen cookie.
SESSION_TTL_MINUTES: int = _env_int("GARDA_SESSION_TTL_MINUTES", 480)
SESSION_COOKIE_NAME: str = "garda_session"
SESSION_COOKIE_SECURE: bool = _env_bool("GARDA_SESSION_COOKIE_SECURE", IS_PRODUCTION)

# Minimum clearance required to run a simulation or record a review decision.
MIN_OPERATOR_CLEARANCE: int = _env_int("GARDA_MIN_CLEARANCE", 2)

# Comma-separated browser origins allowed to call the API directly.
ALLOWED_ORIGINS: list[str] = [
    origin.strip()
    for origin in os.getenv(
        "GARDA_ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if origin.strip()
]

# Naive in-process rate limiting. Adequate for a single-process research
# prototype; replace with a shared store (Redis) before running more than one
# worker, because per-process counters do not compose.
RATE_LIMIT_WINDOW_SECONDS: int = _env_int("GARDA_RATE_LIMIT_WINDOW_SECONDS", 60)
RATE_LIMIT_MAX_REQUESTS: int = _env_int("GARDA_RATE_LIMIT_MAX_REQUESTS", 60)

# Bounded list reads so a growing ledger cannot be dumped in one response.
MAX_PAGE_SIZE: int = _env_int("GARDA_MAX_PAGE_SIZE", 200)

PBKDF2_ITERATIONS: int = _env_int("GARDA_PBKDF2_ITERATIONS", 210_000)

# Strict OT mode is a server-side policy setting, not a UI preference. A browser
# toggle previously implied control over it while the server always enforced it;
# now the authority lives here and the UI reflects this value.
STRICT_OT_MODE: bool = _env_bool("GARDA_STRICT_OT_MODE", True)


def ensure_data_dir() -> None:
    """Create the private data directory if it is missing."""
    DATA_DIR.mkdir(mode=0o700, parents=True, exist_ok=True)
    try:
        os.chmod(DATA_DIR, 0o700)
    except OSError:  # pragma: no cover - best effort on exotic filesystems
        pass
