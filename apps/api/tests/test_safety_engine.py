import pytest
from apps.api.src.safety_engine import DeterministicSafetyEngine


def test_sec_ot_01_rejects_non_synthetic_assets():
    """Rule SEC-OT-01: Prohibits targeting live or arbitrary unapproved assets."""
    is_passed, verdicts, reason = DeterministicSafetyEngine.evaluate(
        strategy_code="STRAT-B",
        target_asset="PRODUCTION-DB-LIVE-01",
        operator_id="analyst-demo-03"
    )
    assert not is_passed
    assert "outside synthetic boundary" in reason.lower()
    assert verdicts.get("SEC-OT-01") == "VIOLATION_UNKNOWN_TARGET"


def test_sec_ot_02_enforces_analyst_clearance():
    """Rule SEC-OT-02: Requires valid operator clearance identifier."""
    is_passed, verdicts, reason = DeterministicSafetyEngine.evaluate(
        strategy_code="STRAT-B",
        target_asset="APP-GW-02",
        operator_id="unauthorized-intruder"
    )
    assert not is_passed
    assert "clearance" in reason.lower()
    assert verdicts.get("SEC-OT-02") == "VIOLATION_UNAUTHORIZED"


def test_sec_ot_03_preserves_root_identity():
    """Rule SEC-OT-03: Blocks direct isolation of root identity service."""
    is_passed, verdicts, reason = DeterministicSafetyEngine.evaluate(
        strategy_code="STRAT-B",
        target_asset="IDENTITY-SVC-01",
        operator_id="analyst-demo-03"
    )
    assert not is_passed
    assert "identity" in reason.lower()
    assert verdicts.get("SEC-OT-03") == "VIOLATION_IDENTITY_COMPROMISED"


def test_sec_ot_04_blocks_strat_a_telemetry_cutoff():
    """Rule SEC-OT-04: Blocks STRAT-A because it abruptly severs telemetry to the OT controller."""
    is_passed, verdicts, reason = DeterministicSafetyEngine.evaluate(
        strategy_code="STRAT-A",
        target_asset="APP-GW-02",
        operator_id="analyst-demo-03",
        strict_ot_mode=True
    )
    assert not is_passed
    assert verdicts.get("SEC-OT-04") == "VIOLATION_BLOCKED"
    assert "telemetry stream" in reason.lower()


def test_sec_ot_04_allows_strat_b_recommended_candidate():
    """Verifies STRAT-B complies with all 5 safety rules."""
    is_passed, verdicts, reason = DeterministicSafetyEngine.evaluate(
        strategy_code="STRAT-B",
        target_asset="APP-GW-02",
        operator_id="analyst-demo-03",
        strict_ot_mode=True
    )
    assert is_passed
    assert reason is None
    assert all(v == "PASSED" for v in verdicts.values())
    assert len(verdicts) == 5


def test_reproducibility_hash_consistency():
    """Verifies that identical inputs yield identical integrity hashes."""
    hash1 = DeterministicSafetyEngine.compute_integrity_hash("INC-2026-0042", "STRAT-B", "2026-10-26T15:00:00Z")
    hash2 = DeterministicSafetyEngine.compute_integrity_hash("INC-2026-0042", "STRAT-B", "2026-10-26T15:00:00Z")
    assert hash1 == hash2
    assert len(hash1) == 64  # SHA256 length
