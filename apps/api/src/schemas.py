"""Typed request/response contracts for the GARDA-SIM API.

Two rules are enforced here rather than in route handlers:

1. Every client-supplied string is bounded, so a request cannot be used to grow
   memory or the audit ledger without limit.
2. Identity is never accepted from the body. ``operator_id``/``reviewer_id`` are
   resolved from the authenticated session, which is what stops a caller from
   self-certifying as an analyst.

``extra="forbid"`` is deliberate: an unknown field is a client bug or an attack
attempt, and both deserve a loud 422 rather than silent tolerance.
"""

from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

# The modelled candidate set. Declared as a Literal so an unmodelled strategy is
# rejected at the schema boundary instead of reaching the scoring engine.
StrategyCode = Literal["STRAT-A", "STRAT-B", "STRAT-C"]

ReviewDecision = Literal["Approved for Demonstration", "Rejected", "Requires More Evidence"]


class StrictModel(BaseModel):
    """Reject unknown fields instead of silently ignoring them."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


# --------------------------------------------------------------------------- #
# Synthetic fixtures (read-only projections)
# --------------------------------------------------------------------------- #
class SyntheticEvidenceSchema(StrictModel):
    id: str = Field(..., description="Unique evidence identifier, e.g. EVD-101")
    timestamp: str = Field(..., description="ISO8601 observation timestamp")
    source: str = Field(..., description="Probe or detector source")
    category: Literal["Observed Fact", "Derived Assessment", "Policy Validation"]
    description: str
    raw_payload: Dict[str, Any] = Field(default_factory=dict)
    associated_asset: str


class VirtualAssetSchema(StrictModel):
    id: str = Field(..., description="Asset identifier, e.g. APP-GW-02")
    name: str
    type: Literal["gateway", "identity", "ot_controller", "monitoring", "dashboard", "telemetry"]
    status: Literal["healthy", "at_risk", "compromised", "isolated"]
    ip_address: str
    criticality: Literal["high", "critical", "medium"]
    depends_on: List[str] = Field(default_factory=list)


class CandidateStrategySchema(StrictModel):
    id: str
    code: str
    name: str
    description: str
    security_benefit_score: int = Field(..., ge=0, le=100)
    simulated_downtime_minutes: int = Field(..., ge=0)
    recovery_effort: Literal["Low", "Medium", "High"]
    impacted_services: List[str] = Field(default_factory=list)
    safety_policy_status: Literal["PASSED", "VIOLATION_BLOCKED"]
    safety_violation_reason: Optional[str] = None
    is_ai_recommended: bool = False
    ai_rationale: str


class IncidentSchema(StrictModel):
    id: str = Field(..., description="Incident identifier, e.g. INC-2026-0042")
    title: str
    severity: Literal["critical", "warning", "info", "neutral"]
    status: Literal["active", "investigating", "awaiting_review", "contained", "simulated"]
    target_asset: str
    detected_at: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    synthetic_identity: str
    summary: str
    affected_services: List[str] = Field(default_factory=list)


# --------------------------------------------------------------------------- #
# Authentication
# --------------------------------------------------------------------------- #
class LoginRequestSchema(StrictModel):
    operator_id: str = Field(..., min_length=1, max_length=64)
    password: str = Field(..., min_length=1, max_length=256)


class SessionSchema(BaseModel):
    operator_id: str
    display_name: str
    clearance: int
    expires_at: str
    synthetic_session: bool = True


# --------------------------------------------------------------------------- #
# Simulation
# --------------------------------------------------------------------------- #
class SimulationRequestSchema(StrictModel):
    scenario_id: str = Field(
        ..., min_length=1, max_length=64, description="Target synthetic scenario ID"
    )
    strategy_code: StrategyCode = Field(..., description="STRAT-A, STRAT-B, or STRAT-C")
    target_asset: str = Field(..., min_length=1, max_length=64)


class SimulationResultSchema(BaseModel):
    scenario_id: str
    strategy_code: str
    target_asset: str
    operator_id: str
    security_benefit_score: int
    simulated_downtime_minutes: int
    recovery_effort: str
    impacted_services: List[str]
    safety_policy_status: Literal["PASSED", "VIOLATION_BLOCKED"]
    safety_violation_reason: Optional[str] = None
    evaluated_rules: Dict[str, str] = Field(default_factory=dict)
    integrity_hash: str
    timestamp: str
    simulated: bool = True
    audit_id: Optional[str] = None


class ReviewRequestSchema(StrictModel):
    scenario_id: str = Field(..., min_length=1, max_length=64)
    strategy_code: StrategyCode
    decision: ReviewDecision
    notes: str = Field(default="", max_length=2000)


class ReviewResultSchema(BaseModel):
    audit_id: str
    decision: ReviewDecision
    resource: str
    recorded_at: str
    chain_verified: bool
    simulated: bool = True


class IncidentNoteRequestSchema(StrictModel):
    """An analyst investigation note attached to one synthetic scenario."""

    note: str = Field(..., min_length=1, max_length=2000)


class IncidentNoteResultSchema(BaseModel):
    audit_id: str
    scenario_id: str
    recorded_at: str
    chain_verified: bool
    simulated: bool = True


# --------------------------------------------------------------------------- #
# Audit ledger
# --------------------------------------------------------------------------- #
class AuditEntrySchema(BaseModel):
    id: str
    seq: int
    timestamp: str
    actor: str
    event_type: str
    resource: str
    result: str
    details: str
    entry_hash: str
    prev_hash: str
    is_synthetic: bool = False


class AuditTrailResponseSchema(BaseModel):
    entries: List[AuditEntrySchema]
    total: int
    limit: int
    offset: int


class ChainVerificationSchema(BaseModel):
    verified: bool
    checked_entries: int
    broken_seq: Optional[int] = None
    algorithm: str = "HMAC-SHA256 chained"
    note: str = (
        "Verifies the append-only ledger chain with a key held outside the "
        "database. It does not make the log externally notarised."
    )


class HealthSchema(BaseModel):
    status: Literal["ok"]
    environment: str
    simulation_only: bool = True
    data_backend: str
    strict_ot_mode: bool
    min_operator_clearance: int
    session_ttl_minutes: int
