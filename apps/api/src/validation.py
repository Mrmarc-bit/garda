"""Referential validation for simulation and review requests.

Keeping these checks in their own module avoids the circular import that would
appear if ``schemas`` imported the fixtures to validate itself, and keeps the
route handlers thin.
"""

from __future__ import annotations

from typing import Dict

from fastapi import HTTPException, status

from .safety_engine import normalize
from .synthetic_dataset import (
    KNOWN_SCENARIO_IDS,
    KNOWN_STRATEGY_IDS,
    SCENARIO_ASSET_SCOPE,
    SYNTHETIC_ASSET_IDS,
)


def _reject(field: str, message: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail={"field": field, "message": message},
    )


def resolve_scenario(scenario_id: str) -> str:
    """Return the canonical scenario ID, or 400 if it is not in the dataset."""
    canonical = normalize(scenario_id)
    if canonical not in KNOWN_SCENARIO_IDS:
        raise _reject("scenario_id", "Unknown synthetic scenario.")
    return canonical


def resolve_strategy(strategy_code: str) -> str:
    canonical = normalize(strategy_code)
    if canonical not in KNOWN_STRATEGY_IDS:
        raise _reject("strategy_code", "Unknown candidate strategy.")
    return canonical


def resolve_asset(target_asset: str, *, scenario_id: str) -> str:
    """Return the canonical asset ID, enforcing inventory membership and scope.

    Scope matters: simulating a response against an asset that the scenario does
    not touch produces a meaningless recommendation, so it is rejected instead of
    being scored.
    """
    canonical = normalize(target_asset)
    if canonical not in SYNTHETIC_ASSET_IDS:
        raise _reject("target_asset", "Asset is not part of the synthetic inventory.")

    scope = SCENARIO_ASSET_SCOPE.get(normalize(scenario_id), frozenset())
    if canonical not in scope:
        raise _reject(
            "target_asset",
            "Asset is outside the scope of the supplied scenario.",
        )
    return canonical


def validate_simulation_targets(scenario_id: str, strategy_code: str, target_asset: str) -> Dict[str, str]:
    """Validate a triple and return its canonical form."""
    scenario = resolve_scenario(scenario_id)
    strategy = resolve_strategy(strategy_code)
    asset = resolve_asset(target_asset, scenario_id=scenario)
    return {"scenario_id": scenario, "strategy_code": strategy, "target_asset": asset}
