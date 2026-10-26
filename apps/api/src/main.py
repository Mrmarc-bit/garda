from typing import List, Dict, Any
from datetime import datetime, timezone
import uuid
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    IncidentSchema,
    VirtualAssetSchema,
    SyntheticEvidenceSchema,
    CandidateStrategySchema,
    SimulationRequestSchema,
    SimulationResultSchema,
    ReviewRequestSchema,
    AuditEntrySchema
)
from .synthetic_dataset import (
    SYNTHETIC_INCIDENT,
    VIRTUAL_ASSETS,
    SYNTHETIC_EVIDENCE,
    CANDIDATE_STRATEGIES,
    INITIAL_AUDIT_LOGS
)
from .simulation_engine import DeterministicSimulationEngine

app = FastAPI(
    title="GARDA-SIM AI API",
    description="Deterministic Simulation Engine and Decision-Support Backend for Defensive Cybersecurity",
    version="1.0.0"
)

# CORS restricted to local Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session stores for the prototype
_audit_trail: List[AuditEntrySchema] = list(INITIAL_AUDIT_LOGS)


@app.get("/health", tags=["System"])
def health_check() -> Dict[str, str]:
    return {
        "status": "healthy",
        "service": "garda-sim-api",
        "environment": "SYNTHETIC_SIMULATION_ONLY",
        "engine": "deterministic_active"
    }


@app.get("/api/incidents", response_model=List[IncidentSchema], tags=["Incidents"])
def list_incidents() -> List[IncidentSchema]:
    return [SYNTHETIC_INCIDENT]


@app.get("/api/incidents/{incident_id}", response_model=IncidentSchema, tags=["Incidents"])
def get_incident(incident_id: str) -> IncidentSchema:
    if incident_id == SYNTHETIC_INCIDENT.id:
        return SYNTHETIC_INCIDENT
    raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found in synthetic repository.")


@app.get("/api/evidence", response_model=List[SyntheticEvidenceSchema], tags=["Evidence"])
def list_evidence() -> List[SyntheticEvidenceSchema]:
    return SYNTHETIC_EVIDENCE


@app.get("/api/topology", response_model=List[VirtualAssetSchema], tags=["Digital Twin"])
def get_topology() -> List[VirtualAssetSchema]:
    return VIRTUAL_ASSETS


@app.get("/api/strategies", response_model=List[CandidateStrategySchema], tags=["Simulator"])
def list_strategies() -> List[CandidateStrategySchema]:
    return CANDIDATE_STRATEGIES


@app.post("/api/simulate", response_model=SimulationResultSchema, tags=["Simulator"])
def run_simulation(request: SimulationRequestSchema) -> SimulationResultSchema:
    """
    Executes a deterministic simulation of a candidate response action.
    Enforces deterministic safety invariants before returning evaluation scores.
    """
    result = DeterministicSimulationEngine.simulate(request)

    # Append to immutable audit trail
    _audit_trail.insert(
        0,
        AuditEntrySchema(
            id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
            timestamp=datetime.now(timezone.utc).isoformat(),
            actor=request.operator_id,
            event_type="SIMULATION_RUN",
            resource=f"{request.strategy_code} ({request.target_asset})",
            result=result.safety_policy_status,
            details=f"Calculated {result.security_benefit_score}% risk reduction and {result.simulated_downtime_minutes}m downtime.",
            integrity_hash=result.integrity_hash[:12]
        )
    )

    return result


@app.post("/api/recommendations/review", tags=["Review"])
def submit_review(review: ReviewRequestSchema) -> Dict[str, Any]:
    """
    Records an authorized SOC analyst sign-off for a candidate strategy.
    """
    audit_id = f"AUD-{uuid.uuid4().hex[:6].upper()}"
    timestamp = datetime.now(timezone.utc).isoformat()

    _audit_trail.insert(
        0,
        AuditEntrySchema(
            id=audit_id,
            timestamp=timestamp,
            actor=review.reviewer_id,
            event_type="STRATEGY_REVIEW",
            resource=f"{review.strategy_code} ({review.scenario_id})",
            result=review.decision,
            details=review.notes,
            integrity_hash=uuid.uuid4().hex[:12]
        )
    )

    return {
        "status": "success",
        "audit_id": audit_id,
        "recorded_decision": review.decision,
        "timestamp": timestamp
    }


@app.get("/api/audit-trail", response_model=List[AuditEntrySchema], tags=["Audit"])
def get_audit_trail() -> List[AuditEntrySchema]:
    return _audit_trail
