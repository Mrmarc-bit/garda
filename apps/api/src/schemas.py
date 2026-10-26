from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field


class SyntheticEvidenceSchema(BaseModel):
    id: str = Field(..., description="Unique evidence identifier, e.g. EVD-101")
    timestamp: str = Field(..., description="ISO8601 observation timestamp")
    source: str = Field(..., description="Probe or detector source")
    category: Literal["Observed Fact", "Derived Assessment", "Policy Validation"]
    description: str
    raw_payload: Dict[str, Any] = Field(default_factory=dict)
    associated_asset: str


class VirtualAssetSchema(BaseModel):
    id: str = Field(..., description="Asset identifier, e.g. APP-GW-02")
    name: str
    type: Literal["gateway", "identity", "ot_controller", "monitoring", "dashboard", "telemetry"]
    status: Literal["healthy", "at_risk", "compromised", "isolated"]
    ip_address: str
    criticality: Literal["high", "critical", "medium"]
    depends_on: List[str] = Field(default_factory=list)


class CandidateStrategySchema(BaseModel):
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


class IncidentSchema(BaseModel):
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


class SimulationRequestSchema(BaseModel):
    scenario_id: str = Field(..., description="Target synthetic scenario ID, e.g. INC-2026-0042")
    strategy_code: str = Field(..., description="Strategy code, e.g. STRAT-A, STRAT-B, STRAT-C")
    target_asset: str = Field(..., description="Target asset ID, e.g. APP-GW-02")
    operator_id: str = Field(..., description="SOC analyst ID executing the simulation")


class SimulationResultSchema(BaseModel):
    scenario_id: str
    strategy_code: str
    security_benefit_score: int
    simulated_downtime_minutes: int
    recovery_effort: str
    impacted_services: List[str]
    safety_policy_status: Literal["PASSED", "VIOLATION_BLOCKED"]
    safety_violation_reason: Optional[str] = None
    evaluated_rules: Dict[str, str] = Field(default_factory=dict)
    integrity_hash: str
    timestamp: str


class ReviewRequestSchema(BaseModel):
    scenario_id: str
    strategy_code: str
    decision: Literal["Approved for Demonstration", "Rejected", "Requires More Evidence"]
    reviewer_id: str
    notes: str


class AuditEntrySchema(BaseModel):
    id: str
    timestamp: str
    actor: str
    event_type: str
    resource: str
    result: str
    details: str
    integrity_hash: str
