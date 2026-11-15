"""Deterministic safety policy engine.

This module is deliberately free of framework, transport, and storage coupling:
it receives already-resolved facts and returns a verdict. That keeps the safety
policy testable and independent of the AI path, per ADR-003.

Hardening history (see SECURITY.md §Findings):
* Inputs are normalised before comparison, so ``"STRAT-A "``, ``"strat-a"`` and
  ``"STRAT-A\\u200b"`` can no longer slip past a rule.
* Assets are matched against the *inventory*, not a string prefix, so a name
  that merely starts with ``APP-GW`` is not treated as synthetic.
* SEC-OT-04 is decided from the strategy's modelled *effects* (which assets it
  disconnects), not from a label comparison.
* SEC-OT-05 verifies the audit chain instead of unconditionally passing.
* All five verdicts are always reported, so the explainability record is
  complete even on an early violation.
"""

from __future__ import annotations

import hashlib
import hmac
import re
import unicodedata
from typing import Dict, List, Optional, Tuple

from .synthetic_dataset import (
    CANDIDATE_STRATEGIES,
    PROTECTED_ASSET_IDS,
    SYNTHETIC_ASSET_IDS,
    TELEMETRY_CRITICAL_ASSET_IDS,
)

# Characters that must never survive normalisation: zero-width and control
# characters are the classic way to smuggle a second identity past an equality
# check.
_INVISIBLE = re.compile(r"[\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff\x00-\x1f\x7f]")
_WHITESPACE = re.compile(r"\s+")


def normalize(value: Optional[str]) -> str:
    """Canonicalise an identifier for comparison."""
    if not value:
        return ""
    stripped = unicodedata.normalize("NFKC", value)
    stripped = _INVISIBLE.sub("", stripped)
    stripped = _WHITESPACE.sub(" ", stripped).strip()
    return stripped.upper()


STRATEGY_BY_CODE = {normalize(s.code): s for s in CANDIDATE_STRATEGIES}
KNOWN_STRATEGY_CODES = frozenset(STRATEGY_BY_CODE)


class DeterministicSafetyEngine:
    """Enforces the non-negotiable safety invariants, independent of any AI."""

    SAFETY_RULES = {
        "SEC-OT-01": "Zero Real-World Containment Invariant",
        "SEC-OT-02": "Operator Clearance Verification",
        "SEC-OT-03": "Core Identity Service Availability",
        "SEC-OT-04": "Uninterrupted OT Controller Telemetry Stream",
        "SEC-OT-05": "Cryptographic Audit Record Invariant",
    }

    @classmethod
    def evaluate(
        cls,
        *,
        strategy_code: str,
        target_asset: str,
        operator_id: Optional[str],
        operator_clearance: Optional[int],
        audit_chain_verified: bool,
        strict_ot_mode: bool = True,
    ) -> Tuple[bool, Dict[str, str], Optional[str]]:
        """Evaluate a candidate response against all five invariants.

        Returns ``(is_passed, rule_verdicts, violation_reason)``.

        ``operator_clearance`` and ``audit_chain_verified`` are facts the caller
        must resolve from the server-side session and ledger. They have no
        default on purpose: a caller cannot accidentally certify itself.
        """
        verdicts: Dict[str, str] = {}
        reasons: List[str] = []

        asset = normalize(target_asset)
        strategy = normalize(strategy_code)

        # --- SEC-OT-01: target must exist in the synthetic inventory ---------
        if not asset:
            verdicts["SEC-OT-01"] = "VIOLATION_UNKNOWN_TARGET"
            reasons.append("Target asset was not supplied.")
        elif asset not in SYNTHETIC_ASSET_IDS:
            verdicts["SEC-OT-01"] = "VIOLATION_UNKNOWN_TARGET"
            reasons.append("Target asset is outside the synthetic boundary.")
        else:
            verdicts["SEC-OT-01"] = "PASSED"

        # --- SEC-OT-02: a registered operator with sufficient clearance ------
        if not operator_id:
            verdicts["SEC-OT-02"] = "VIOLATION_UNAUTHORIZED"
            reasons.append("No authenticated operator is attached to this request.")
        elif operator_clearance is None:
            verdicts["SEC-OT-02"] = "VIOLATION_UNAUTHORIZED"
            reasons.append("Operator is not registered in the synthetic registry.")
        elif int(operator_clearance) < 2:
            verdicts["SEC-OT-02"] = "VIOLATION_INSUFFICIENT_CLEARANCE"
            reasons.append("Operator clearance is insufficient for a containment simulation.")
        else:
            verdicts["SEC-OT-02"] = "PASSED"

        # --- SEC-OT-03: the root identity service must stay reachable --------
        strategy_record = STRATEGY_BY_CODE.get(strategy)
        affected_assets = (
            {normalize(s) for s in strategy_record.impacted_services}
            if strategy_record
            else set()
        )
        if asset in PROTECTED_ASSET_IDS:
            verdicts["SEC-OT-03"] = "VIOLATION_IDENTITY_COMPROMISED"
            reasons.append("Cannot isolate the root identity controller.")
        elif affected_assets & PROTECTED_ASSET_IDS:
            verdicts["SEC-OT-03"] = "VIOLATION_IDENTITY_COMPROMISED"
            reasons.append("Strategy would disrupt the root identity controller.")
        else:
            verdicts["SEC-OT-03"] = "PASSED"

        # --- SEC-OT-04: OT telemetry must not be severed ---------------------
        if strategy_record is None:
            # Fail closed: an unmodelled action cannot be certified safe.
            verdicts["SEC-OT-04"] = "VIOLATION_UNKNOWN_STRATEGY"
            reasons.append(
                "Strategy code is not part of the modelled candidate set, so its "
                "effects cannot be certified safe."
            )
        elif strict_ot_mode and (affected_assets & TELEMETRY_CRITICAL_ASSET_IDS):
            verdicts["SEC-OT-04"] = "VIOLATION_BLOCKED"
            reasons.append(
                "Violates Safety Rule SEC-OT-04: telemetry stream to the OT controller "
                "must never be abruptly severed without a fail-safe switch."
            )
        else:
            verdicts["SEC-OT-04"] = "PASSED"

        # --- SEC-OT-05: the audit ledger must verify before we admit a run ---
        if audit_chain_verified:
            verdicts["SEC-OT-05"] = "PASSED"
        else:
            verdicts["SEC-OT-05"] = "VIOLATION_AUDIT_INTEGRITY"
            reasons.append(
                "Violates Safety Rule SEC-OT-05: the audit ledger failed integrity "
                "verification, so no new safety-relevant action may be admitted."
            )

        is_passed = all(value == "PASSED" for value in verdicts.values())
        return is_passed, verdicts, (None if is_passed else " ".join(reasons))

    @classmethod
    def compute_integrity_hash(
        cls, scenario_id: str, strategy_code: str, timestamp: str
    ) -> str:
        """Reproducibility fingerprint for an evaluation outcome.

        This is an unkeyed digest used to detect accidental drift between runs.
        It is **not** a tamper-evidence mechanism; that is the audit ledger's
        HMAC chain (see ``storage.verify_chain``).
        """
        payload = f"{scenario_id}:{strategy_code}:{timestamp}:GARDA-SIM-CORE"
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()
