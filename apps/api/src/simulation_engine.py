"""Deterministic simulation engine.

Scores come from the canonical candidate-strategy registry in
``synthetic_dataset``. There is no default/fallback branch: an unmodelled
strategy is a contract violation, not a "Custom Candidate" that gets a made-up
score of 50 (see SECURITY.md §F-01).
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from .safety_engine import DeterministicSafetyEngine, normalize
from .schemas import SimulationRequestSchema, SimulationResultSchema
from .synthetic_dataset import STRATEGY_BY_CODE


class UnmodelledStrategyError(LookupError):
    """Raised when a strategy code has no modelled effect profile."""


class DeterministicSimulationEngine:
    """Authoritative simulation engine for GARDA-SIM AI.

    Computes security benefit, operational downtime, and blast radius from the
    modelled strategy profile, then asks the safety engine for a verdict. The
    engine never invents metrics and never overrides a policy verdict.
    """

    @staticmethod
    def profile_for(strategy_code: str):
        record = STRATEGY_BY_CODE.get(normalize(strategy_code))
        if record is None:
            raise UnmodelledStrategyError(
                f"Strategy {strategy_code!r} has no modelled effect profile."
            )
        return record

    @classmethod
    def simulate(
        cls,
        request: SimulationRequestSchema,
        *,
        operator_id: str,
        operator_clearance: Optional[int],
        audit_chain_verified: bool,
        strict_ot_mode: bool = True,
    ) -> SimulationResultSchema:
        timestamp = datetime.now(timezone.utc).isoformat()
        profile = cls.profile_for(request.strategy_code)

        is_passed, rule_verdicts, violation_reason = DeterministicSafetyEngine.evaluate(
            strategy_code=request.strategy_code,
            target_asset=request.target_asset,
            operator_id=operator_id,
            operator_clearance=operator_clearance,
            audit_chain_verified=audit_chain_verified,
            strict_ot_mode=strict_ot_mode,
        )

        integrity_hash = DeterministicSafetyEngine.compute_integrity_hash(
            scenario_id=request.scenario_id,
            strategy_code=request.strategy_code,
            timestamp=timestamp,
        )

        return SimulationResultSchema(
            scenario_id=request.scenario_id,
            strategy_code=profile.code,
            target_asset=request.target_asset,
            operator_id=operator_id,
            security_benefit_score=profile.security_benefit_score,
            simulated_downtime_minutes=profile.simulated_downtime_minutes,
            recovery_effort=profile.recovery_effort,
            impacted_services=list(profile.impacted_services),
            safety_policy_status="PASSED" if is_passed else "VIOLATION_BLOCKED",
            safety_violation_reason=violation_reason,
            evaluated_rules=rule_verdicts,
            integrity_hash=integrity_hash,
            timestamp=timestamp,
        )
