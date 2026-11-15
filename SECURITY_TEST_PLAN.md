# SECURITY_TEST_PLAN.md — GARDA-SIM AI
## Application Security Testing Plan and Verification Gates

**Document Status:** Baseline v1.1 — results recorded 2026-11-14
**Last Executed:** 2026-11-14
**Governing Documents:** `SECURITY.md`, `THREAT_MODEL.md`, `AGENTS.md`, `IMPLEMENTATION_STATUS.md`

> Every test below carries its **actual** result. `Passed` means the check was executed and produced that outcome in this working tree. `Not run` means exactly that — it is not an implicit pass.

---

## 1. Testing Scope and Objectives

Verify the mandatory requirements of `SECURITY.md`: authentication safety, server-side authorization, input validation, deterministic safety invariants, ledger integrity, and secret protection.

---

## 2. Test Suites and Automated Checks

### 2.1 Static Analysis & Dependency Vulnerabilities

| Check | Command | Result |
|---|---|---|
| Secret scanning (no `.env`, keys, passwords committed) | manual review of the tree + `.gitignore` | **Passed** — no secret in source; `.garda/`, `.env*`, `*.pem`, `*.key` are ignored; the demo password is generated at first boot into a 0600 file |
| Dependency audit | `npm audit`, `pip-audit` | **Not run** — no audit result is recorded for this build. Open release-gate item |
| Strict TypeScript | `npx --no-install tsc --noEmit -p apps/web/tsconfig.json` | **Passed** — exit 0, no output |
| Production build | `npm --workspace=@garda-sim/web run build` | **Passed** — 31 routes, middleware 34.2 kB |
| ESLint security plugins | — | **Not configured** in this repo |

### 2.2 Functional Security & Invariant Tests

| Test ID | Category | Objective | Verification method | Result |
|---|---|---|---|---|
| **SEC-01** | Authentication | Reject invalid credentials; rate-limit login attempts | `apps/api/tests/test_api.py` (wrong password, unknown operator, constant-work path) | **Passed** — 401 on both; login is inside the rate-limited dependency set |
| **SEC-02** | Session security | HttpOnly, SameSite, path-scoped, revoked on logout, expired tokens rejected | `test_api.py` asserts the raw `set-cookie` header; `test_storage.py` asserts revoked/expired sessions do not resolve | **Passed** — `HttpOnly`, `SameSite=Lax`, `Path=/` asserted from the header; a session token is stored only as SHA-256 |
| **SEC-03** | Authorization (IDOR) | A user cannot act as another identity | `operator_id`/`reviewer_id` removed from request bodies; `StrictModel(extra="forbid")` → 422 | **Passed for identity spoofing** — a payload claiming another operator is rejected. **Not applicable** for cross-tenant object access: there is a single tenant and no per-record ownership, so IDOR in the multi-user sense has no surface yet |
| **SEC-04** | Safety invariant | The engine blocks prohibited responses even when a client asks for them | `apps/api/tests/test_safety_engine.py`, plus live `curl` | **Passed** — `STRAT-A ` / `strat-a` / `STRAT-A\u200b` / `STRAT-A\t` never score as passing; unknown strategy → 422; approving a blocked strategy → **403** |
| **SEC-05** | Input sanitisation | Malicious payloads (XSS, SQLi, command injection, path traversal, null bytes) are rejected or neutralised | `test_api.py` (control-character stripping, `'; DROP TABLE audit; --`, `APP-GW/../../etc/passwd`, oversized fields) | **Passed** — SQL is parameterised only; non-printables stripped before append; unknown/out-of-scope identifiers → 400; oversized fields → 400/422 |
| **SEC-06** | AI output validation | Malformed or injected AI output is rejected by schema validators | — | **Not applicable yet** — no AI provider exists. The requirement is carried in `IMPLEMENTATION_STATUS.md` §7 |
| **SEC-07** | Audit integrity | Critical actions produce tamper-evident audit records | `test_storage.py` + live `sqlite3` and `GET /api/audit-trail/verify` | **Passed** — `UPDATE`/`DELETE` raise "append-only"; after a forced rewrite the chain reports `verified: false` with the broken sequence. The records are **append-only and tamper-evident**, not immutable (see EXC-005) |

### 2.3 Additional checks executed in this pass

| Check | Result |
|---|---|
| Unauthenticated access to all protected routes | **Passed** — 7 reads and both writes return 401 |
| Forged credential | **Passed** — a `Bearer` token is ignored; the session cookie is the only credential |
| Untrusted `Origin` on a state-changing call | **Passed** — 403 |
| Low-clearance operator | **Passed** — 403 |
| Security headers on API responses | **Passed** — CSP, `X-Frame-Options: DENY`, `nosniff`, `no-referrer`, `no-store`, `X-Request-ID` |
| Navigation guard | **Passed** — `GET /app/audit-trail` → `307 → /login?next=…` |
| Rate limiting | **Passed** (unit) — 429 with `Retry-After`; per-client isolation asserted |
| Pagination bounds | **Passed** — `limit=5000` → 422 |
| Stack traces / secrets in error bodies | **Passed** — structured `detail` only; 404 does not echo the requested identifier |
| Browser console across all 14 `/app` routes | **Passed** — no hydration errors, no unhandled exceptions, no failed API calls |

**Backend suite total:** `PYTHONPATH=. ./apps/api/.venv/bin/pytest apps/api/tests -q` → **101 passed, 1 warning** (StarletteDeprecationWarning: httpx with `starlette.testclient`).

---

## 3. Release Gate Criteria

A milestone may be marked `Verified` only when all of the following hold. Current gate state:

1. **All relevant security test cases pass.** — *Met for SEC-01, SEC-02, SEC-03 (identity), SEC-04, SEC-05, SEC-07. SEC-06 is blocked on a component that does not exist.*
2. **Zero High or Critical unmitigated vulnerabilities in dependencies.** — *Not met: no dependency audit has been run.*
3. **No secrets in source or client bundles.** — *Met.*
4. **`SIMULATION ONLY` visible across all authenticated views.** — *Met: verified in the browser on every `/app` route.*
5. **Production build succeeds.** — *Met.*

Gate 2 and the missing SEC-06 are why `IMPLEMENTATION_STATUS.md` records M7 as **not ready for production** rather than verified.
