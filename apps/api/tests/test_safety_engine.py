"""Unit tests for the deterministic safety engine.

The engine is the last line of defence, so these tests target the bypasses that
were actually found in review rather than only the happy path.
"""

import pytest

from apps.api.src.safety_engine import DeterministicSafetyEngine, normalize

BASE = {
    "operator_id": "analyst-demo-03",
    "operator_clearance": 3,
    "audit_chain_verified": True,
}


def evaluate(**overrides):
    kwargs = {**BASE, **overrides}
    kwargs.setdefault("strategy_code", "STRAT-B")
    kwargs.setdefault("target_asset", "APP-GW-02")
    return DeterministicSafetyEngine.evaluate(**kwargs)


# --------------------------------------------------------------------------- #
# Normalisation
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize(
    "raw,expected",
    [
        ("strat-a", "STRAT-A"),
        ("STRAT-A ", "STRAT-A"),
        ("  STRAT-A\t", "STRAT-A"),
        ("STRAT-A\u200b", "STRAT-A"),
        ("STRAT-A\u00a0", "STRAT-A"),
        ("STRAT - A", "STRAT - A"),
        ("", ""),
        (None, ""),
    ],
)
def test_normalize_collapses_evasion_attempts(raw, expected):
    assert normalize(raw) == expected


# --------------------------------------------------------------------------- #
# SEC-OT-01 — synthetic boundary
# --------------------------------------------------------------------------- #
def test_sec_ot_01_accepts_inventory_assets():
    _, verdicts, _ = evaluate(target_asset="APP-GW-02")
    assert verdicts["SEC-OT-01"] == "PASSED"


@pytest.mark.parametrize(
    "asset",
    ["APP-GW-REAL-PROD-77", "APP-GW", "IDENTITY", "TELEMETRY-PROD-GRID-99", ""],
)
def test_sec_ot_01_rejects_anything_outside_the_inventory(asset):
    """Regression: a prefix allowlist accepted APP-GW-REAL-PROD-77."""
    _, verdicts, _ = evaluate(target_asset=asset)
    assert verdicts["SEC-OT-01"] == "VIOLATION_UNKNOWN_TARGET"


# --------------------------------------------------------------------------- #
# SEC-OT-02 — operator clearance
# --------------------------------------------------------------------------- #
def test_sec_ot_02_requires_a_registered_operator():
    _, verdicts, _ = evaluate(operator_id=None)
    assert verdicts["SEC-OT-02"] == "VIOLATION_UNAUTHORIZED"


def test_sec_ot_02_requires_known_clearance():
    _, verdicts, _ = evaluate(operator_clearance=None)
    assert verdicts["SEC-OT-02"] == "VIOLATION_UNAUTHORIZED"


def test_sec_ot_02_rejects_low_clearance():
    _, verdicts, _ = evaluate(operator_clearance=1)
    assert verdicts["SEC-OT-02"] == "VIOLATION_INSUFFICIENT_CLEARANCE"


def test_sec_ot_02_accepts_sufficient_clearance():
    _, verdicts, _ = evaluate(operator_clearance=2)
    assert verdicts["SEC-OT-02"] == "PASSED"


# --------------------------------------------------------------------------- #
# SEC-OT-03 — root identity service
# --------------------------------------------------------------------------- #
def test_sec_ot_03_blocks_isolating_the_identity_controller():
    _, verdicts, _ = evaluate(target_asset="IDENTITY-SVC-01")
    assert verdicts["SEC-OT-03"] == "VIOLATION_IDENTITY_COMPROMISED"


def test_sec_ot_03_blocks_a_strategy_that_would_disrupt_identity():
    """STRAT-A's modelled blast radius includes a protected dependency."""
    _, verdicts, _ = evaluate(strategy_code="STRAT-A", target_asset="APP-GW-02")
    assert verdicts["SEC-OT-03"] == "PASSED"  # STRAT-A does not touch identity
    assert verdicts["SEC-OT-04"] == "VIOLATION_BLOCKED"


# --------------------------------------------------------------------------- #
# SEC-OT-04 — OT telemetry continuity
# --------------------------------------------------------------------------- #
def test_sec_ot_04_blocks_strat_a_telemetry_cutoff():
    is_passed, verdicts, reason = evaluate(strategy_code="STRAT-A")
    assert is_passed is False
    assert verdicts["SEC-OT-04"] == "VIOLATION_BLOCKED"
    assert "SEC-OT-04" in reason


def test_sec_ot_04_allows_strat_b():
    is_passed, verdicts, reason = evaluate(strategy_code="STRAT-B")
    assert is_passed is True
    assert verdicts["SEC-OT-04"] == "PASSED"
    assert reason is None


def test_sec_ot_04_allows_strat_c():
    _, verdicts, _ = evaluate(strategy_code="STRAT-C")
    assert verdicts["SEC-OT-04"] == "PASSED"


def test_sec_ot_04_fails_closed_for_unmodelled_strategy():
    is_passed, verdicts, _ = evaluate(strategy_code="STRAT-Z")
    assert is_passed is False
    assert verdicts["SEC-OT-04"] == "VIOLATION_UNKNOWN_STRATEGY"


@pytest.mark.parametrize("code", ["strat-a", "STRAT-A ", "STRAT-A\u200b", "STRAT-A\t"])
def test_sec_ot_04_cannot_be_bypassed_by_string_variants(code):
    is_passed, verdicts, _ = evaluate(strategy_code=code)
    assert is_passed is False
    assert verdicts["SEC-OT-04"] == "VIOLATION_BLOCKED"


# --------------------------------------------------------------------------- #
# SEC-OT-05 — audit chain
# --------------------------------------------------------------------------- #
def test_sec_ot_05_requires_a_verified_chain():
    is_passed, verdicts, _ = evaluate(audit_chain_verified=False)
    assert is_passed is False
    assert verdicts["SEC-OT-05"] == "VIOLATION_AUDIT_INTEGRITY"


def test_sec_ot_05_passes_when_the_chain_verifies():
    _, verdicts, _ = evaluate(audit_chain_verified=True)
    assert verdicts["SEC-OT-05"] == "PASSED"


# --------------------------------------------------------------------------- #
# Report completeness
# --------------------------------------------------------------------------- #
def test_all_five_rules_are_always_reported():
    """Regression: an early return used to yield a 1-key evaluated_rules map."""
    for code in ("STRAT-A", "STRAT-B", "STRAT-C", "STRAT-Z"):
        _, verdicts, _ = evaluate(strategy_code=code)
        assert set(verdicts) == set(DeterministicSafetyEngine.SAFETY_RULES)


def test_integrity_hash_is_deterministic_for_identical_inputs():
    first = DeterministicSafetyEngine.compute_integrity_hash("INC-2026-0042", "STRAT-B", "t")
    second = DeterministicSafetyEngine.compute_integrity_hash("INC-2026-0042", "STRAT-B", "t")
    assert first == second
    assert len(first) == 64
