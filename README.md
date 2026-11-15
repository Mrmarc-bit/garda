# GARDA-SIM AI

Defensive cyber-response **simulation lab**. It models candidate response strategies
against a fixed inventory of fictional IT/OT assets, evaluates them with a
deterministic safety engine, records every run in an append-only ledger, and
presents the result for human review.

> **SIMULATION ONLY.** Every asset, incident and evidence record is an authored
> synthetic fixture. Nothing in this repository resolves a hostname, opens a socket,
> issues a containment command, or connects to a real network.

---

## 1. What actually works

| Capability | Status |
| --- | --- |
| Session auth (login / logout / session resolution) | Implemented, server-side |
| Protected API (14 routes, session + clearance) | Implemented, 401/403 enforced |
| Deterministic safety invariants SEC-OT-01 … 05 | Implemented, fail-closed |
| Server-side approval gate (blocked strategy → 403) | Implemented |
| Append-only audit ledger (SQLite triggers + HMAC-SHA256 chain) | Implemented |
| Chain verification endpoint | Implemented |
| Response simulator (real `POST /api/simulate`) | Implemented |
| Human review decisions + analyst notes (real ledger writes) | Implemented |
| Reports / exports (JSON, Markdown, CSV) | Implemented, built from live data |
| Measured run harness (latency measured per iteration) | Implemented |
| **AI rationale generation** | **Not implemented** — rationale strings are authored fixtures |
| **Live ingestion of real telemetry** | **Not implemented** — no connector exists |
| **Real containment actions** | **Not implemented, by design** |

`IMPLEMENTATION_STATUS.md` holds the full, evidence-backed status matrix.

---

## 2. Prerequisites

- Node.js 20+ and npm (workspaces)
- Python 3.12+ (this repo's venv was built with 3.15)

## 3. Setup

```bash
npm install
python3 -m venv apps/api/.venv
./apps/api/.venv/bin/pip install -r apps/api/requirements.txt
```

## 4. Run

Two processes, two terminals:

```bash
npm run api     # FastAPI on http://127.0.0.1:8000
npm run dev     # Next.js on http://127.0.0.1:3000
```

Open <http://127.0.0.1:3000/login>.

### Demo credentials

On first boot the API seeds three demo operators and, if `GARDA_DEMO_PASSWORD`
is not set, generates one password for all of them:

```bash
cat .garda/demo-credentials.txt
```

| Operator ID | Name | Clearance |
| --- | --- | --- |
| `analyst-demo-03` | Nadia Rahman | 2 |
| `analyst-demo-01` | Rizky Pratama | 3 |
| `auditor-demo-02` | Sari Wulandari | 3 |

The login page's **Quick Demo Access** button signs in with the first operator
without you needing to read the file.

## 5. Configuration

All settings are environment variables read by `apps/api/src/config.py`.
See `.env.example`. Defaults are safe for local development.

| Variable | Default | Purpose |
| --- | --- | --- |
| `GARDA_ENV` | `development` | `production` disables `/docs`, `/redoc`, `/openapi.json` and the demo-credential hint, and requires a real `GARDA_DEMO_PASSWORD` |
| `GARDA_DATA_DIR` | `<repo>/.garda` | Private (0700) directory holding the SQLite ledger, HMAC key and bootstrap credentials |
| `GARDA_DEMO_PASSWORD` | generated | Password for the three seeded demo operators |
| `GARDA_AUDIT_SECRET` | generated | HMAC key for the ledger chain; generated once into `audit-secret.key` |
| `GARDA_SESSION_TTL_MINUTES` | `480` | Session lifetime |
| `GARDA_SESSION_COOKIE_SECURE` | `true` in production | Marks the session cookie `Secure` |
| `GARDA_MIN_CLEARANCE` | `2` | Minimum clearance to simulate or review |
| `GARDA_STRICT_OT_MODE` | `true` | Server-side policy for SEC-OT-04 |
| `GARDA_ALLOWED_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | CORS allow-list |
| `GARDA_RATE_LIMIT_MAX_REQUESTS` | `60` | Requests per window, per process |
| `GARDA_RATE_LIMIT_WINDOW_SECONDS` | `60` | Rate-limit window |
| `GARDA_MAX_PAGE_SIZE` | `200` | Upper bound for paged ledger reads |
| `NEXT_PUBLIC_API_BASE` | empty (same origin) | Point the web client at a different API origin |

## 6. Verify

```bash
npm test                                          # typecheck + pytest
npm --workspace=@garda-sim/web run build          # production build
```

Current state: **98 backend tests pass**, `tsc --noEmit` exits 0, and the
production build prerenders 31 routes.

## 7. Data storage

Runtime state lives in a git-ignored `.garda/` directory:

- `garda.db` — operators, sessions, audit ledger (SQLite, WAL)
- `audit-secret.key` — HMAC key for the ledger chain, 0600
- `demo-credentials.txt` — generated demo password, 0600

Ledger rows are protected by SQLite triggers that reject `UPDATE` and `DELETE`,
and each entry hash covers the previous hash. This makes tampering **detectable**;
it is **not** external notarisation and not a claim of immutability.

To reset, stop the API and delete `.garda/`. Deleting it invalidates every
previously recorded hash.

## 8. Data modes

- **Simulated data — ready.** The lab is functional end to end against the
  synthetic fixtures.
- **Real data — not ready, and not supported.** There is no ingestion path, no
  multi-tenant scoping, no PostgreSQL/migrations and no external identity
  provider. Pointing this build at real telemetry would violate `AGENTS.md` §6.
  `IMPLEMENTATION_STATUS.md` §5 lists the five prerequisites that would have to
  land first.

## 9. Documentation

| File | Contents |
| --- | --- |
| `PRD.md` | Product requirements |
| `ARSITEKTUR.md` | System boundaries and data flow |
| `DESIGN.md` / `DESIGN_HANDOFF.md` | Design system and recorded deviations |
| `SECURITY.md` | Security baseline and its implementation status |
| `THREAT_MODEL.md` | Threats and verification status |
| `SECURITY_TEST_PLAN.md` | Security test cases and results |
| `SECURITY_EXCEPTIONS.md` | Accepted risks and retired findings |
| `DECISIONS.md` | Architecture decision records |
| `IMPLEMENTATION_STATUS.md` | What is built, what is not, and the evidence |
| `ROUTE_INVENTORY.md` | Every page and API route with its auth requirement |
