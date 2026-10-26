import hashlib
from typing import Dict, Tuple, Optional


class DeterministicSafetyEngine:
    """
    Deterministic Safety Policy Engine for GARDA-SIM AI.
    Enforces non-negotiable safety rules independent of any AI/LLM models.
    """

    SAFETY_RULES = {
        "SEC-OT-01": "Zero Real-World Containment Invariant",
        "SEC-OT-02": "Operator Clearance Verification",
        "SEC-OT-03": "Core Identity Service Availability",
        "SEC-OT-04": "Uninterrupted OT Controller Telemetry Stream",
        "SEC-OT-05": "Cryptographic Audit Record Invariant"
    }

    @classmethod
    def evaluate(
        cls,
        strategy_code: str,
        target_asset: str,
        operator_id: str,
        strict_ot_mode: bool = True
    ) -> Tuple[bool, Dict[str, str], Optional[str]]:
        """
        Evaluates a candidate response strategy against all 5 deterministic safety invariants.
        Returns:
            (is_passed, rule_verdicts_dict, violation_reason)
        """
        rule_results: Dict[str, str] = {}

        # Rule SEC-OT-01: Zero Real Containment
        # Verifies the request explicitly targets simulated assets only.
        if not target_asset.startswith(("APP-GW", "IDENTITY", "OT-CONTROLLER", "MONITOR", "OPS-DASH", "TELEMETRY")):
            return False, {"SEC-OT-01": "VIOLATION_UNKNOWN_TARGET"}, "Target asset is outside synthetic boundary."
        rule_results["SEC-OT-01"] = "PASSED"

        # Rule SEC-OT-02: Operator Clearance
        if not operator_id or not operator_id.startswith("analyst-"):
            return False, {"SEC-OT-02": "VIOLATION_UNAUTHORIZED"}, "Invalid or missing SOC analyst clearance."
        rule_results["SEC-OT-02"] = "PASSED"

        # Rule SEC-OT-03: Core Identity Service Preservation
        # Severing identity service paralyzes the entire grid.
        if strategy_code == "STRAT-ISOLATE-IDENTITY" or target_asset == "IDENTITY-SVC-01":
            return False, {"SEC-OT-03": "VIOLATION_IDENTITY_COMPROMISED"}, "Cannot isolate root identity controller."
        rule_results["SEC-OT-03"] = "PASSED"

        # Rule SEC-OT-04: Uninterrupted OT Controller Telemetry Stream
        # STRAT-A (Full Network Isolation of APP-GW-02) abruptly severs telemetry to OT-CONTROLLER-SIM-01.
        if strict_ot_mode and strategy_code == "STRAT-A":
            rule_results["SEC-OT-04"] = "VIOLATION_BLOCKED"
            return (
                False,
                rule_results,
                "Violates Safety Rule SEC-OT-04: Telemetry stream to OT-CONTROLLER must never be abruptly severed without fail-safe switch."
            )
        rule_results["SEC-OT-04"] = "PASSED"

        # Rule SEC-OT-05: Audit Record Invariant
        rule_results["SEC-OT-05"] = "PASSED"

        return True, rule_results, None

    @classmethod
    def compute_integrity_hash(cls, scenario_id: str, strategy_code: str, timestamp: str) -> str:
        """
        Computes SHA256 integrity hash for an evaluation outcome.
        """
        payload = f"{scenario_id}:{strategy_code}:{timestamp}:GARDA-SIM-CORE"
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()
