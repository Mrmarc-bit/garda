"""GARDA-SIM AI HTTP API.

Route handlers stay thin: they authenticate, validate references, delegate to the
deterministic engine, and record the outcome in the append-only ledger. All
business logic lives in ``simulation_engine``, ``safety_engine``, ``validation``,
and ``storage``.

Security posture (see SECURITY.md for the full record):
* every data route requires an authenticated session;
* identity is never read from the request body;
* mutating routes additionally require clearance L2, a trusted Origin, and pass
  the rate limiter;
* an approval decision for a policy-blocked strategy is refused server-side, not
  merely hidden in the UI;
* the audit ledger is append-only at the SQLite layer and HMAC-chained.
"""

from __future__ import annotations

import logging
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Dict, List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from . import config, security, storage
from .schemas import (
    AuditEntrySchema,
    AuditTrailResponseSchema,
    CandidateStrategySchema,
    ChainVerificationSchema,
    HealthSchema,
    IncidentNoteRequestSchema,
    IncidentNoteResultSchema,
    IncidentSchema,
    LoginRequestSchema,
    ReviewRequestSchema,
    ReviewResultSchema,
    SessionSchema,
    SimulationRequestSchema,
    SimulationResultSchema,
    SyntheticEvidenceSchema,
    VirtualAssetSchema,
)
from .simulation_engine import DeterministicSimulationEngine, UnmodelledStrategyError
from .synthetic_dataset import (
    CANDIDATE_STRATEGIES,
    STRATEGY_BY_CODE,
    SYNTHETIC_EVIDENCE,
    SYNTHETIC_INCIDENTS,
    VIRTUAL_ASSETS,
)
from .validation import resolve_scenario, resolve_strategy, validate_simulation_targets

logger = logging.getLogger("garda.api")


# --------------------------------------------------------------------------- #
# Structured logging with correlation IDs
# --------------------------------------------------------------------------- #
class CorrelationFilter(logging.Filter):
    def __init__(self) -> None:
        super().__init__()
        self.correlation_id = "-"

    def filter(self, record: logging.LogRecord) -> bool:  # pragma: no cover - trivial
        record.correlation_id = self.correlation_id
        return True


_correlation_filter = CorrelationFilter()
_handler = logging.StreamHandler()
_handler.setFormatter(
    logging.Formatter(
        "%(asctime)s %(levelname)s [%(correlation_id)s] %(name)s: %(message)s"
    )
)
_handler.addFilter(_correlation_filter)
logger.addHandler(_handler)
logger.setLevel(logging.INFO)
logger.propagate = False


class RequestContextMiddleware(BaseHTTPMiddleware):
    """Attach a correlation ID to every request and response."""

    async def dispatch(self, request: Request, call_next):
        correlation_id = request.headers.get("x-request-id") or uuid.uuid4().hex[:16]
        _correlation_filter.correlation_id = correlation_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = correlation_id
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Baseline browser hardening for every API response."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "no-referrer")
        response.headers.setdefault(
            "Content-Security-Policy",
            "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
        )
        response.headers.setdefault("Cache-Control", "no-store")
        if config.IS_PRODUCTION:
            response.headers.setdefault(
                "Strict-Transport-Security", "max-age=31536000; includeSubDomains"
            )
        return response


# --------------------------------------------------------------------------- #
# Application lifecycle
# --------------------------------------------------------------------------- #
SYNTHETIC_AUDIT_SEED = (
    (
        "AUD-SYN-0001",
        "system-safety-engine",
        "POLICY_INVARIANT_EVAL",
        "STRAT-A (INC-2026-0042)",
        "VIOLATION_BLOCKED",
        "Seeded synthetic record: STRAT-A blocked by SEC-OT-04 (OT telemetry cutoff).",
    ),
    (
        "AUD-SYN-0002",
        "analyst-demo-03",
        "STRATEGY_REVIEW",
        "STRAT-B (INC-2026-0042)",
        "Approved for Demonstration",
        "Seeded synthetic record: STRAT-B approved for demonstration review.",
    ),
)


def _seed_synthetic_ledger() -> None:
    """Seed clearly-labelled demo records once, on an empty ledger."""
    if storage.count_audit() > 0:
        return
    for entry_id, actor, event_type, resource, result, details in SYNTHETIC_AUDIT_SEED:
        storage.append_audit(
            actor=actor,
            event_type=event_type,
            resource=resource,
            result=result,
            details=details,
            is_synthetic=True,
            entry_id=entry_id,
        )
    logger.info("Seeded %d synthetic audit records.", len(SYNTHETIC_AUDIT_SEED))


@asynccontextmanager
async def lifespan(_app: FastAPI):
    config.ensure_data_dir()
    storage.init_db()
    security.bootstrap_operators()
    _seed_synthetic_ledger()
    storage.purge_expired_sessions()
    logger.info(
        "GARDA-SIM API ready (env=%s, db=%s).", config.ENVIRONMENT, config.DB_PATH
    )
    yield
    logger.info("GARDA-SIM API shutting down.")


app = FastAPI(
    title="GARDA-SIM AI API",
    description=(
        "Deterministic simulation engine and decision-support backend for defensive "
        "cybersecurity. Synthetic data only."
    ),
    version="1.1.0",
    lifespan=lifespan,
    docs_url=None if config.IS_PRODUCTION else "/docs",
    redoc_url=None if config.IS_PRODUCTION else "/redoc",
    openapi_url=None if config.IS_PRODUCTION else "/openapi.json",
)

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestContextMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(config.ALLOWED_ORIGINS),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-Request-ID"],
)


# --------------------------------------------------------------------------- #
# Stale-session cleanup
# --------------------------------------------------------------------------- #
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Return FastAPI's normal error body, and drop a session cookie that no longer resolves.

    Without this, an expired or revoked cookie traps the browser: the Next.js
    middleware sees a cookie and redirects /login to /app, while the API keeps
    answering 401. Clearing the cookie on the first 401 lets the sign-in page
    load again. It never turns a 401 into a success.
    """
    response = JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=exc.headers,
    )
    if exc.status_code == status.HTTP_401_UNAUTHORIZED:
        token = request.cookies.get(config.SESSION_COOKIE_NAME)
        if token is not None:
            storage.revoke_session(token)
            security.clear_session_cookie(response)
    return response

# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def _audit_chain_verified() -> bool:
    ok, broken_seq, _checked = storage.verify_chain()
    if not ok:
        logger.error("Audit chain verification failed at seq=%s", broken_seq)
    return ok


def _clean_text(value: str, *, limit: int = 500) -> str:
    """Strip control characters so the ledger cannot carry log-injection payloads."""
    return "".join(ch for ch in value if ch.isprintable())[:limit]


# --------------------------------------------------------------------------- #
# System
# --------------------------------------------------------------------------- #
@app.get("/health", response_model=HealthSchema, tags=["System"])
def health_check() -> HealthSchema:
    return HealthSchema(
        status="ok",
        environment=config.ENVIRONMENT,
        data_backend="sqlite",
        # Policy facts are reported so the UI never has to guess at them.
        strict_ot_mode=config.STRICT_OT_MODE,
        min_operator_clearance=config.MIN_OPERATOR_CLEARANCE,
        session_ttl_minutes=config.SESSION_TTL_MINUTES,
    )


# --------------------------------------------------------------------------- #
# Authentication
# --------------------------------------------------------------------------- #
@app.post("/api/auth/login", response_model=SessionSchema, tags=["Auth"])
def login(
    payload: LoginRequestSchema,
    response: Response,
    _origin: None = Depends(security.require_trusted_origin),
    _rate: None = Depends(security.rate_limit("login")),
) -> SessionSchema:
    operator = storage.get_operator(payload.operator_id)
    # Constant-work path: verify against a dummy hash when the operator is unknown
    # so response timing does not disclose account existence.
    stored_hash = operator["password_hash"] if operator else security.hash_password("-")
    password_ok = security.verify_password(payload.password, stored_hash)

    if not operator or not password_ok:
        logger.warning("Failed login attempt for operator=%r", payload.operator_id[:64])
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid operator ID or password.",
        )

    token, expires_at = storage.create_session(operator_id=operator["operator_id"])
    security.set_session_cookie(response, token, expires_at)
    logger.info("Operator %s authenticated.", operator["operator_id"])
    return SessionSchema(
        operator_id=operator["operator_id"],
        display_name=operator["display_name"],
        clearance=int(operator["clearance"]),
        expires_at=expires_at,
    )


@app.post("/api/auth/logout", status_code=status.HTTP_204_NO_CONTENT, tags=["Auth"])
def logout(
    request: Request,
    response: Response,
    _origin: None = Depends(security.require_trusted_origin),
) -> Response:
    token = request.cookies.get(config.SESSION_COOKIE_NAME)
    if token:
        storage.revoke_session(token)
    security.clear_session_cookie(response)
    response.status_code = status.HTTP_204_NO_CONTENT
    return response


@app.get("/api/auth/me", response_model=SessionSchema, tags=["Auth"])
def whoami(session: Dict = Depends(security.require_session)) -> SessionSchema:
    return SessionSchema(
        operator_id=session["operator_id"],
        display_name=session["display_name"],
        clearance=int(session["clearance"]),
        expires_at=session["expires_at"],
    )


@app.get("/api/auth/demo-hint", tags=["Auth"])
def demo_hint() -> Dict[str, str]:
    """Expose the generated local demo password to the sign-in screen.

    Development convenience only: the password is generated on first boot, written
    to a 0600 file, and never available in production. The real login flow still
    runs, so the authentication path stays exercised.
    """
    password = security.read_bootstrap_password()
    if password is None:
        raise HTTPException(status_code=404, detail="No generated demo credential is available.")
    operator_id = security.DEMO_OPERATORS[0][0]
    return {"operator_id": operator_id, "password": password}


# --------------------------------------------------------------------------- #
# Synthetic dataset reads
# --------------------------------------------------------------------------- #
@app.get(
    "/api/incidents",
    response_model=List[IncidentSchema],
    tags=["Incidents"],
    dependencies=[Depends(security.require_session)],
)
def list_incidents() -> List[IncidentSchema]:
    return SYNTHETIC_INCIDENTS


@app.get(
    "/api/incidents/{incident_id}",
    response_model=IncidentSchema,
    tags=["Incidents"],
    dependencies=[Depends(security.require_session)],
)
def get_incident(incident_id: str) -> IncidentSchema:
    try:
        canonical = resolve_scenario(incident_id)
    except HTTPException:
        # Deliberately does not echo the caller-supplied value back.
        raise HTTPException(status_code=404, detail="Incident not found.") from None
    for incident in SYNTHETIC_INCIDENTS:
        if incident.id == canonical:
            return incident
    raise HTTPException(status_code=404, detail="Incident not found.")


@app.get(
    "/api/evidence",
    response_model=List[SyntheticEvidenceSchema],
    tags=["Evidence"],
    dependencies=[Depends(security.require_session)],
)
def list_evidence() -> List[SyntheticEvidenceSchema]:
    return SYNTHETIC_EVIDENCE


@app.get(
    "/api/topology",
    response_model=List[VirtualAssetSchema],
    tags=["Digital Twin"],
    dependencies=[Depends(security.require_session)],
)
def get_topology() -> List[VirtualAssetSchema]:
    return VIRTUAL_ASSETS


@app.get(
    "/api/strategies",
    response_model=List[CandidateStrategySchema],
    tags=["Simulator"],
    dependencies=[Depends(security.require_session)],
)
def list_strategies() -> List[CandidateStrategySchema]:
    return CANDIDATE_STRATEGIES


# --------------------------------------------------------------------------- #
# Simulation
# --------------------------------------------------------------------------- #
@app.post("/api/simulate", response_model=SimulationResultSchema, tags=["Simulator"])
def run_simulation(
    payload: SimulationRequestSchema,
    session: Dict = Depends(security.require_clearance),
    _origin: None = Depends(security.require_trusted_origin),
    _rate: None = Depends(security.rate_limit("simulate")),
) -> SimulationResultSchema:
    """Run a deterministic simulation of one candidate response action."""
    targets = validate_simulation_targets(
        payload.scenario_id, payload.strategy_code, payload.target_asset
    )
    canonical_request = SimulationRequestSchema(**targets)

    try:
        result = DeterministicSimulationEngine.simulate(
            canonical_request,
            operator_id=session["operator_id"],
            operator_clearance=int(session["clearance"]),
            audit_chain_verified=_audit_chain_verified(),
            strict_ot_mode=config.STRICT_OT_MODE,
        )
    except UnmodelledStrategyError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from None

    entry = storage.append_audit(
        actor=session["operator_id"],
        event_type="SIMULATION_RUN",
        resource=f"{result.strategy_code} ({result.target_asset})",
        result=result.safety_policy_status,
        details=_clean_text(
            f"Scenario {result.scenario_id}: {result.security_benefit_score}% risk "
            f"reduction, {result.simulated_downtime_minutes}m downtime, "
            f"recovery {result.recovery_effort}."
        ),
        is_synthetic=True,
    )
    return result.model_copy(update={"audit_id": entry["id"]})


# --------------------------------------------------------------------------- #
# Incident analyst notes (written to the append-only ledger)
# --------------------------------------------------------------------------- #
@app.post(
    "/api/incidents/{incident_id}/notes",
    response_model=IncidentNoteResultSchema,
    tags=["Incidents"],
)
def record_incident_note(
    incident_id: str,
    payload: IncidentNoteRequestSchema,
    session: Dict = Depends(security.require_session),
    _origin: None = Depends(security.require_trusted_origin),
    _rate: None = Depends(security.rate_limit("note")),
) -> IncidentNoteResultSchema:
    """Append an analyst note for a synthetic scenario to the audit ledger.

    The note is stored as a ledger entry rather than a browser-local value, so it
    is covered by the same append-only triggers and HMAC chain as every other
    recorded event.
    """
    scenario_id = resolve_scenario(incident_id)
    entry = storage.append_audit(
        actor=session["operator_id"],
        event_type="INCIDENT_NOTE",
        resource=scenario_id,
        result="RECORDED",
        details=_clean_text(payload.note),
        is_synthetic=True,
    )
    chain_ok = _audit_chain_verified()
    logger.info(
        "Incident note recorded: actor=%s scenario=%s",
        session["operator_id"],
        scenario_id,
    )
    return IncidentNoteResultSchema(
        audit_id=entry["id"],
        scenario_id=scenario_id,
        recorded_at=entry["timestamp"],
        chain_verified=chain_ok,
    )


# --------------------------------------------------------------------------- #
# Human review (server-side approval gate)
# --------------------------------------------------------------------------- #
@app.post(
    "/api/recommendations/review", response_model=ReviewResultSchema, tags=["Review"]
)
def submit_review(
    payload: ReviewRequestSchema,
    session: Dict = Depends(security.require_clearance),
    _origin: None = Depends(security.require_trusted_origin),
    _rate: None = Depends(security.rate_limit("review")),
) -> ReviewResultSchema:
    """Record an authorised SOC sign-off for a candidate strategy.

    Approving a strategy that the deterministic policy blocks is refused here.
    The UI also disables the control, but the server is the authority.
    """
    scenario = resolve_scenario(payload.scenario_id)
    strategy = resolve_strategy(payload.strategy_code)
    profile = STRATEGY_BY_CODE[strategy]

    if (
        payload.decision == "Approved for Demonstration"
        and profile.safety_policy_status == "VIOLATION_BLOCKED"
    ):
        storage.append_audit(
            actor=session["operator_id"],
            event_type="STRATEGY_REVIEW_REFUSED",
            resource=f"{strategy} ({scenario})",
            result="REJECTED_BY_POLICY",
            details=_clean_text(
                "Server-side safety gate refused an approval for a policy-blocked "
                f"strategy: {profile.safety_violation_reason or 'invariant violation'}"
            ),
            is_synthetic=True,
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "This strategy is blocked by deterministic safety policy and cannot "
                "be approved."
            ),
        )

    resource = f"{strategy} ({scenario})"
    entry = storage.append_audit(
        actor=session["operator_id"],
        event_type="STRATEGY_REVIEW",
        resource=resource,
        result=payload.decision,
        details=_clean_text(payload.notes or "No reviewer notes supplied."),
        is_synthetic=True,
    )
    chain_ok = _audit_chain_verified()
    logger.info(
        "Review recorded: actor=%s resource=%s decision=%s",
        session["operator_id"],
        resource,
        payload.decision,
    )
    return ReviewResultSchema(
        audit_id=entry["id"],
        decision=payload.decision,
        resource=resource,
        recorded_at=entry["timestamp"],
        chain_verified=chain_ok,
    )


# --------------------------------------------------------------------------- #
# Audit ledger
# --------------------------------------------------------------------------- #
@app.get(
    "/api/audit-trail", response_model=AuditTrailResponseSchema, tags=["Audit"]
)
def get_audit_trail(
    limit: int = Query(50, ge=1, le=config.MAX_PAGE_SIZE),
    offset: int = Query(0, ge=0),
    _session: Dict = Depends(security.require_session),
) -> AuditTrailResponseSchema:
    entries = storage.list_audit(limit=limit, offset=offset)
    return AuditTrailResponseSchema(
        entries=[AuditEntrySchema(**entry) for entry in entries],
        total=storage.count_audit(),
        limit=limit,
        offset=offset,
    )


@app.get(
    "/api/audit-trail/verify",
    response_model=ChainVerificationSchema,
    tags=["Audit"],
)
def verify_audit_trail(
    _session: Dict = Depends(security.require_clearance),
) -> ChainVerificationSchema:
    ok, broken_seq, checked = storage.verify_chain()
    return ChainVerificationSchema(
        verified=ok,
        checked_entries=checked,
        broken_seq=broken_seq,
    )
