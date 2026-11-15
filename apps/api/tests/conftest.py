"""Shared test configuration.

The data directory and bootstrap credentials are redirected to a throwaway
location *before* ``config`` is imported, so the suite never touches a developer's
real ledger and never depends on ambient environment variables.
"""

import os
import tempfile

_DATA_DIR = tempfile.mkdtemp(prefix="garda-test-")
os.environ["GARDA_DATA_DIR"] = _DATA_DIR
os.environ["GARDA_ENV"] = "test"
os.environ["GARDA_DEMO_PASSWORD"] = "test-password-123"
# The rate limiter is exercised directly; keep it out of the way of functional
# tests so one test cannot make another flaky.
os.environ["GARDA_RATE_LIMIT_MAX_REQUESTS"] = "100000"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

TEST_OPERATOR = "analyst-demo-03"
TEST_PASSWORD = "test-password-123"


@pytest.fixture(scope="session")
def app_module():
    """Import the app and run its lifespan once for the whole session."""
    from apps.api.src.main import app

    with TestClient(app):
        yield app


@pytest.fixture()
def anon_client(app_module):
    """A client with no session cookie."""
    return TestClient(app_module)


@pytest.fixture(scope="session")
def auth_client(app_module):
    """A client holding a valid operator session."""
    client = TestClient(app_module)
    response = client.post(
        "/api/auth/login",
        json={"operator_id": TEST_OPERATOR, "password": TEST_PASSWORD},
    )
    assert response.status_code == 200, response.text
    return client


@pytest.fixture(scope="session")
def low_clearance_client(app_module):
    """A client whose operator sits below the clearance gate (L1)."""
    from apps.api.src import security, storage

    storage.upsert_operator(
        operator_id="intern-demo-01",
        display_name="Intern Demo",
        clearance=1,
        password_hash=security.hash_password(TEST_PASSWORD),
    )
    client = TestClient(app_module)
    response = client.post(
        "/api/auth/login",
        json={"operator_id": "intern-demo-01", "password": TEST_PASSWORD},
    )
    assert response.status_code == 200, response.text
    return client
