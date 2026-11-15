"""API contract and security tests.

Each test states the invariant it protects, because several of these encode a
regression that previously shipped: unauthenticated access, self-declared
identity, a bypassable strategy allowlist, and an approval gate that lived only
in the browser.
"""

import pytest

from apps.api.tests.conftest import TEST_OPERATOR

# --------------------------------------------------------------------------- #
# System
# --------------------------------------------------------------------------- #


def test_health_endpoint(anon_client):
    response = anon_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["simulation_only"] is True
    assert data["data_backend"] == "sqlite"


def test_security_headers_present(anon_client):
    response = anon_client.get("/health")
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-Frame-Options"] == "DENY"
    assert response.headers["Referrer-Policy"] == "no-referrer"
    assert "frame-ancestors 'none'" in response.headers["Content-Security-Policy"]
    assert response.headers["X-Request-ID"]


# --------------------------------------------------------------------------- #
# Authentication and authorization
# --------------------------------------------------------------------------- #
PROTECTED_READS = [
    "/api/incidents",
    "/api/incidents/INC-2026-0042",
    "/api/evidence",
    "/api/topology",
    "/api/strategies",
    "/api/audit-trail",
    "/api/auth/me",
]


@pytest.mark.parametrize("path", PROTECTED_READS)
def test_protected_reads_require_a_session(anon_client, path):
    assert anon_client.get(path).status_code == 401


def test_simulation_requires_a_session(anon_client):
    response = anon_client.post(
        "/api/simulate",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-B",
            "target_asset": "APP-GW-02",
        },
    )
    assert response.status_code == 401


def test_review_requires_a_session(anon_client):
    response = anon_client.post(
        "/api/recommendations/review",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-B",
            "decision": "Approved for Demonstration",
        },
    )
    assert response.status_code == 401


def test_forged_bearer_token_is_not_identity(anon_client):
    response = anon_client.get(
        "/api/incidents", headers={"Authorization": "Bearer not-a-real-token"}
    )
    assert response.status_code == 401


def test_login_success_returns_session(auth_client):
    response = auth_client.get("/api/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["operator_id"] == TEST_OPERATOR
    assert data["clearance"] >= 2
    assert data["synthetic_session"] is True


def test_login_wrong_password_is_rejected(anon_client):
    response = anon_client.post(
        "/api/auth/login",
        json={"operator_id": TEST_OPERATOR, "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_login_unknown_operator_is_rejected(anon_client):
    response = anon_client.post(
        "/api/auth/login",
        json={"operator_id": "ghost-operator", "password": "test-password-123"},
    )
    assert response.status_code == 401


def test_session_cookie_is_httponly(app_module):
    from fastapi.testclient import TestClient

    client = TestClient(app_module)
    login = client.post(
        "/api/auth/login",
        json={"operator_id": TEST_OPERATOR, "password": "test-password-123"},
    )
    assert login.status_code == 200
    set_cookie = login.headers["set-cookie"].lower()
    assert "httponly" in set_cookie
    assert "samesite=lax" in set_cookie
    assert "path=/" in set_cookie


def test_login_rejects_untrusted_origin(anon_client):
    response = anon_client.post(
        "/api/auth/login",
        json={"operator_id": TEST_OPERATOR, "password": "test-password-123"},
        headers={"Origin": "https://evil.example"},
    )
    assert response.status_code == 403


def test_logout_revokes_the_session(app_module):
    from fastapi.testclient import TestClient

    client = TestClient(app_module)
    login = client.post(
        "/api/auth/login",
        json={"operator_id": TEST_OPERATOR, "password": "test-password-123"},
    )
    assert login.status_code == 200
    assert client.post("/api/auth/logout").status_code == 204
    assert client.get("/api/incidents").status_code == 401


def test_insufficient_clearance_is_forbidden(low_clearance_client):
    assert low_clearance_client.get("/api/incidents").status_code == 200
    response = low_clearance_client.post(
        "/api/simulate",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-B",
            "target_asset": "APP-GW-02",
        },
    )
    assert response.status_code == 403


# --------------------------------------------------------------------------- #
# Synthetic dataset reads
# --------------------------------------------------------------------------- #
def test_list_incidents(auth_client):
    response = auth_client.get("/api/incidents")
    assert response.status_code == 200
    incidents = response.json()
    assert len(incidents) == 2
    assert incidents[0]["id"] == "INC-2026-0042"


def test_get_incident_by_id_success(auth_client):
    response = auth_client.get("/api/incidents/INC-2026-0042")
    assert response.status_code == 200
    assert response.json()["target_asset"] == "APP-GW-02"


def test_get_incident_by_id_404_does_not_echo_input(auth_client):
    response = auth_client.get("/api/incidents/INC-9999-NOTFOUND")
    assert response.status_code == 404
    assert "INC-9999-NOTFOUND" not in response.text


def test_get_topology(auth_client):
    response = auth_client.get("/api/topology")
    assert response.status_code == 200
    assets = response.json()
    assert len(assets) == 6
    asset_ids = [asset["id"] for asset in assets]
    assert "APP-GW-02" in asset_ids
    assert "OT-CONTROLLER-SIM-01" in asset_ids


def test_list_evidence(auth_client):
    response = auth_client.get("/api/evidence")
    assert response.status_code == 200
    assert len(response.json()) == 4


# --------------------------------------------------------------------------- #
# Simulation
# --------------------------------------------------------------------------- #
def test_simulate_strat_b_passed(auth_client):
    response = auth_client.post(
        "/api/simulate",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-B",
            "target_asset": "APP-GW-02",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["safety_policy_status"] == "PASSED"
    assert data["security_benefit_score"] == 88
    assert data["simulated_downtime_minutes"] == 0
    assert data["operator_id"] == TEST_OPERATOR
    assert len(data["evaluated_rules"]) == 5
    assert all(v == "PASSED" for v in data["evaluated_rules"].values())


def test_simulate_strat_a_blocked_by_ot_invariant(auth_client):
    response = auth_client.post(
        "/api/simulate",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-A",
            "target_asset": "APP-GW-02",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["safety_policy_status"] == "VIOLATION_BLOCKED"
    assert data["evaluated_rules"]["SEC-OT-04"] == "VIOLATION_BLOCKED"
    assert "sec-ot-04" in data["safety_violation_reason"].lower()


@pytest.mark.parametrize("strategy_code", ["STRAT-A ", " STRAT-A", "STRAT-A\t"])
def test_whitespace_variants_are_never_scored_as_a_passing_candidate(
    auth_client, strategy_code
):
    """Regression: these variants previously scored 50/30m and passed.

    Either outcome is acceptable — a strict 422 rejection or a normal blocked
    evaluation. What must never happen again is a fabricated PASSED verdict.
    """
    response = auth_client.post(
        "/api/simulate",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": strategy_code,
            "target_asset": "APP-GW-02",
        },
    )
    assert response.status_code in (200, 422)
    if response.status_code == 200:
        data = response.json()
        assert data["safety_policy_status"] == "VIOLATION_BLOCKED"
        assert data["security_benefit_score"] == 94


def test_zero_width_variant_is_rejected_outright(auth_client):
    """A zero-width space is not a whitespace variant; it is an invalid code."""
    response = auth_client.post(
        "/api/simulate",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-A\u200b",
            "target_asset": "APP-GW-02",
        },
    )
    assert response.status_code == 422


@pytest.mark.parametrize(
    "strategy_code",
    ["STRAT-Z", "strat-a", "", "STRAT-B' OR '1'='1", "STRAT-A-CUSTOM"],
)
def test_unmodelled_strategy_is_rejected_not_scored(auth_client, strategy_code):
    """Regression: an unknown code used to return a fabricated 50% score."""
    response = auth_client.post(
        "/api/simulate",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": strategy_code,
            "target_asset": "APP-GW-02",
        },
    )
    assert response.status_code == 422


def test_client_supplied_operator_id_is_rejected(auth_client):
    """Identity comes from the session; the body may not declare it."""
    response = auth_client.post(
        "/api/simulate",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-B",
            "target_asset": "APP-GW-02",
            "operator_id": "hacker-01",
        },
    )
    assert response.status_code == 422


@pytest.mark.parametrize(
    "scenario_id", ["INC-0000-0000", "INC-FAKE-9999", "'; DROP TABLE audit_entries; --"]
)
def test_unknown_scenario_is_rejected(auth_client, scenario_id):
    response = auth_client.post(
        "/api/simulate",
        json={
            "scenario_id": scenario_id,
            "strategy_code": "STRAT-B",
            "target_asset": "APP-GW-02",
        },
    )
    assert response.status_code == 400


@pytest.mark.parametrize(
    "target_asset",
    ["APP-GW-REAL-PROD-77", "APP-GW", "IDENTITY", "TELEMETRY-PROD-GRID-99"],
)
def test_non_inventory_asset_is_rejected(auth_client, target_asset):
    """Regression: a prefix allowlist accepted any name starting with APP-GW."""
    response = auth_client.post(
        "/api/simulate",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-B",
            "target_asset": target_asset,
        },
    )
    assert response.status_code in (400, 422)


def test_asset_outside_scenario_scope_is_rejected(auth_client):
    response = auth_client.post(
        "/api/simulate",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-B",
            "target_asset": "MONITOR-01",
        },
    )
    assert response.status_code == 400


def test_oversized_field_is_rejected(auth_client):
    response = auth_client.post(
        "/api/simulate",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-B",
            "target_asset": "APP-GW-02" + "A" * 5000,
        },
    )
    assert response.status_code in (400, 422)


# --------------------------------------------------------------------------- #
# Human review — the server-side approval gate
# --------------------------------------------------------------------------- #
def test_review_approves_a_passing_strategy(auth_client):
    response = auth_client.post(
        "/api/recommendations/review",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-B",
            "decision": "Approved for Demonstration",
            "notes": "Verified telemetry stream is uninterrupted.",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["decision"] == "Approved for Demonstration"
    assert data["audit_id"].startswith("AUD-")
    assert data["chain_verified"] is True


def test_review_cannot_approve_a_blocked_strategy(auth_client):
    """Regression: the SEC-OT-04 approval block used to be browser-only."""
    response = auth_client.post(
        "/api/recommendations/review",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-A",
            "decision": "Approved for Demonstration",
            "notes": "Trying to force an approval past the policy.",
        },
    )
    assert response.status_code == 403


def test_review_can_reject_a_blocked_strategy(auth_client):
    response = auth_client.post(
        "/api/recommendations/review",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-A",
            "decision": "Rejected",
            "notes": "Policy violation confirmed.",
        },
    )
    assert response.status_code == 200


def test_review_rejects_client_supplied_reviewer(auth_client):
    response = auth_client.post(
        "/api/recommendations/review",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-B",
            "decision": "Approved for Demonstration",
            "reviewer_id": "hacker-01",
        },
    )
    assert response.status_code == 422


# --------------------------------------------------------------------------- #
# Audit ledger
# --------------------------------------------------------------------------- #
def test_audit_trail_is_paged_and_chained(auth_client):
    response = auth_client.get("/api/audit-trail", params={"limit": 2, "offset": 0})
    assert response.status_code == 200
    data = response.json()
    assert data["limit"] == 2
    assert len(data["entries"]) <= 2
    assert data["total"] >= 2
    for entry in data["entries"]:
        assert len(entry["entry_hash"]) == 64
        assert len(entry["prev_hash"]) == 64
        assert isinstance(entry["seq"], int)


def test_audit_trail_rejects_oversized_page(auth_client):
    assert auth_client.get("/api/audit-trail", params={"limit": 5000}).status_code == 422


def test_audit_chain_verifies(auth_client):
    response = auth_client.get("/api/audit-trail/verify")
    assert response.status_code == 200
    data = response.json()
    assert data["verified"] is True
    assert data["checked_entries"] >= 2
    assert data["broken_seq"] is None


def test_seeded_entries_are_marked_synthetic(auth_client):
    response = auth_client.get("/api/audit-trail", params={"limit": 200})
    seeded = [e for e in response.json()["entries"] if e["id"].startswith("AUD-SYN-")]
    assert seeded, "expected the seeded synthetic records to be present"
    assert all(entry["is_synthetic"] for entry in seeded)


def test_audit_details_strip_control_characters(auth_client):
    auth_client.post(
        "/api/recommendations/review",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-B",
            "decision": "Rejected",
            "notes": "line\u0000break\u0007 injected",
        },
    )
    response = auth_client.get("/api/audit-trail", params={"limit": 5})
    notes = [e["details"] for e in response.json()["entries"]]
    assert not any("\u0000" in note or "\u0007" in note for note in notes)


def test_simulation_writes_an_audit_entry(auth_client):
    before = auth_client.get("/api/audit-trail", params={"limit": 1}).json()["total"]
    auth_client.post(
        "/api/simulate",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-C",
            "target_asset": "APP-GW-02",
        },
    )
    after = auth_client.get("/api/audit-trail", params={"limit": 1}).json()["total"]
    assert after == before + 1


def test_expired_or_unknown_cookie_is_cleared_on_401(anon_client):
    """A cookie the server cannot resolve must be dropped, not silently reused.

    Otherwise the browser keeps presenting a dead cookie: the Next.js middleware
    redirects /login to /app on the strength of it, and the API answers 401, which
    traps the operator between two pages with no way to sign in again.
    """
    anon_client.cookies.set("garda_session", "definitely-not-a-real-session-token")
    response = anon_client.get("/api/incidents")
    assert response.status_code == 401
    cleared = response.headers.get("set-cookie", "").lower()
    assert "garda_session=" in cleared
    assert "max-age=0" in cleared or "expires=thu, 01 jan 1970" in cleared


def test_unauthenticated_401_still_returns_the_error_body(anon_client):
    response = anon_client.get("/api/incidents")
    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication required."


def test_production_mode_removes_interactive_api_docs(tmp_path):
    """`GARDA_ENV=production` must remove /docs, /redoc and /openapi.json.

    Those routes are unauthenticated by design in FastAPI and describe every
    payload shape, so they are a development-only convenience. This runs in a
    subprocess so the reloaded configuration cannot leak into other tests.
    """
    import os
    import subprocess
    import sys

    env = dict(os.environ)
    env.update(
        {
            "GARDA_ENV": "production",
            "GARDA_DATA_DIR": str(tmp_path),
            "GARDA_DEMO_PASSWORD": "production-test-password",
            "PYTHONPATH": ".",
        }
    )
    probe = (
        "from apps.api.src.main import app;"
        "print(app.docs_url, app.redoc_url, app.openapi_url)"
    )
    result = subprocess.run(
        [sys.executable, "-c", probe],
        capture_output=True,
        text=True,
        env=env,
        cwd=os.getcwd(),
        timeout=120,
    )
    assert result.returncode == 0, result.stderr
    assert result.stdout.strip() == "None None None"


def test_ledger_key_replacement_surfaces_as_503(auth_client, monkeypatch, tmp_path):
    """A key swapped underneath a running process must fail closed, not silently.

    Reading stored rows still works — the rows are readable, they are simply no
    longer verifiable — but anything that needs the key (chain verification, and
    every append) must answer 503 with an actionable message rather than a 500,
    a stack trace, or a success the next restart cannot verify.
    """
    from apps.api.src import config, storage

    # The key this process booted with is cached in a module global, and that
    # cache is what makes the mismatch detectable. Register it with monkeypatch
    # so teardown restores it, and this test can never leave a foreign key
    # cached and break appends in later tests.
    monkeypatch.setattr(storage, "_AUDIT_KEY", storage._AUDIT_KEY)

    other_key = tmp_path / "other-key"
    other_key.write_bytes(b"a-completely-different-key-value")
    monkeypatch.setattr(config, "AUDIT_SECRET_PATH", other_key)

    # Stored rows are still listable.
    assert auth_client.get("/api/audit-trail").status_code == 200

    # Verification needs the key, so it fails closed.
    verify = auth_client.get("/api/audit-trail/verify")
    assert verify.status_code == 503
    assert "signing key" in verify.json()["detail"].lower()

    # A write is refused rather than appended with a key that no longer matches.
    write = auth_client.post(
        "/api/simulate",
        json={
            "scenario_id": "INC-2026-0042",
            "strategy_code": "STRAT-B",
            "target_asset": "APP-GW-02",
        },
    )
    assert write.status_code == 503

    # Neither failure may leak internals.
    assert "Traceback" not in verify.text
    assert "Traceback" not in write.text
