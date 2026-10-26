import pytest
from fastapi.testclient import TestClient
from apps.api.src.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["environment"] == "SYNTHETIC_SIMULATION_ONLY"


def test_list_incidents():
    response = client.get("/api/incidents")
    assert response.status_code == 200
    incidents = response.json()
    assert len(incidents) >= 1
    assert incidents[0]["id"] == "INC-2026-0042"


def test_get_incident_by_id_success():
    response = client.get("/api/incidents/INC-2026-0042")
    assert response.status_code == 200
    assert response.json()["target_asset"] == "APP-GW-02"


def test_get_incident_by_id_404():
    response = client.get("/api/incidents/INC-9999-NOTFOUND")
    assert response.status_code == 404


def test_get_topology():
    response = client.get("/api/topology")
    assert response.status_code == 200
    assets = response.json()
    assert len(assets) == 6
    asset_ids = [a["id"] for a in assets]
    assert "APP-GW-02" in asset_ids
    assert "OT-CONTROLLER-SIM-01" in asset_ids


def test_simulate_strat_b_passed():
    payload = {
        "scenario_id": "INC-2026-0042",
        "strategy_code": "STRAT-B",
        "target_asset": "APP-GW-02",
        "operator_id": "analyst-demo-03"
    }
    response = client.post("/api/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["safety_policy_status"] == "PASSED"
    assert data["security_benefit_score"] == 88
    assert data["simulated_downtime_minutes"] == 0


def test_simulate_strat_a_blocked():
    payload = {
        "scenario_id": "INC-2026-0042",
        "strategy_code": "STRAT-A",
        "target_asset": "APP-GW-02",
        "operator_id": "analyst-demo-03"
    }
    response = client.post("/api/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["safety_policy_status"] == "VIOLATION_BLOCKED"
    assert "violates safety rule sec-ot-04" in data["safety_violation_reason"].lower()


def test_submit_review():
    payload = {
        "scenario_id": "INC-2026-0042",
        "strategy_code": "STRAT-B",
        "decision": "Approved for Demonstration",
        "reviewer_id": "analyst-demo-03",
        "notes": "Verified telemetry stream is uninterrupted."
    }
    response = client.post("/api/recommendations/review", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["recorded_decision"] == "Approved for Demonstration"


def test_audit_trail_populated():
    response = client.get("/api/audit-trail")
    assert response.status_code == 200
    logs = response.json()
    assert len(logs) >= 2
