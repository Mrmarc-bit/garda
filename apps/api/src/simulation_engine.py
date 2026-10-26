from datetime import datetime, timezone
from typing import Dict, Any
from .schemas import SimulationRequestSchema, SimulationResultSchema
from .safety_engine import DeterministicSafetyEngine


class DeterministicSimulationEngine:
    """
    Authoritative simulation engine for GARDA-SIM AI.
    Calculates security benefit, operational downtime, and blast radius deterministically.
    """

    STRATEGY_CONFIGS = {
        "STRAT-A": {
            "name": "Full Network Isolation of APP-GW-02",
            "security_benefit_score": 94,
            "simulated_downtime_minutes": 45,
            "recovery_effort": "High",
            "impacted_services": ["OPS-DASH-01", "TELEMETRY-SIM-01", "APP-GW-02"]
        },
        "STRAT-B": {
            "name": "Targeted Ingress Block & Credential Invalidation",
            "security_benefit_score": 88,
            "simulated_downtime_minutes": 0,
            "recovery_effort": "Low",
            "impacted_services": []
        },
        "STRAT-C": {
            "name": "Host Process Termination & Re-authentication",
            "security_benefit_score": 72,
            "simulated_downtime_minutes": 5,
            "recovery_effort": "Medium",
            "impacted_services": ["APP-GW-02 (transient)"]
        }
    }

    @classmethod
    def simulate(cls, request: SimulationRequestSchema) -> SimulationResultSchema:
        timestamp = datetime.now(timezone.utc).isoformat()
        config = cls.STRATEGY_CONFIGS.get(request.strategy_code, {
            "name": "Custom Candidate",
            "security_benefit_score": 50,
            "simulated_downtime_minutes": 30,
            "recovery_effort": "Medium",
            "impacted_services": [request.target_asset]
        })

        # Evaluate safety invariants deterministically
        is_passed, rule_verdicts, violation_reason = DeterministicSafetyEngine.evaluate(
            strategy_code=request.strategy_code,
            target_asset=request.target_asset,
            operator_id=request.operator_id
        )

        integrity_hash = DeterministicSafetyEngine.compute_integrity_hash(
            scenario_id=request.scenario_id,
            strategy_code=request.strategy_code,
            timestamp=timestamp
        )

        return SimulationResultSchema(
            scenario_id=request.scenario_id,
            strategy_code=request.strategy_code,
            security_benefit_score=config["security_benefit_score"],
            simulated_downtime_minutes=config["simulated_downtime_minutes"],
            recovery_effort=config["recovery_effort"],
            impacted_services=config["impacted_services"],
            safety_policy_status="PASSED" if is_passed else "VIOLATION_BLOCKED",
            safety_violation_reason=violation_reason,
            evaluated_rules=rule_verdicts,
            integrity_hash=integrity_hash,
            timestamp=timestamp
        )
