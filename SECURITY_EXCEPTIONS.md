# SECURITY_EXCEPTIONS.md — GARDA-SIM AI
## Security Exception Register and Risk Acceptance Log

**Document Status:** Active register
**Last Reviewed:** 2026-11-14
**Governing Documents:** `SECURITY.md`, `AGENTS.md`, `IMPLEMENTATION_STATUS.md`

> **Correction notice.** Two entries in the previous version of this file described controls that did not exist at the time: EXC-001 claimed "SQLite file persistence" before any database code existed, and EXC-002 claimed a "deterministic fallback stub when LLM API keys are unset" when no AI provider — not even a stub — had been written. EXC-002 has been **withdrawn** (an exception cannot cover a feature that does not exist). EXC-001 is now factually true and has been rewritten to describe the code that actually runs.

---

## 1. Exception Policy

Any deviation from the security baseline in `SECURITY.md` requires:

1. A documented finding ID and risk level.
2. Concrete business/technical rationale.
3. A named owner and approval.
4. Specific, verifiable compensating controls.
5. A time-bounded review date.

No Critical or High exploitable vulnerability may be accepted for a production release without an approved exception. An exception must describe a control that exists and can be demonstrated; a claim of a control that has not been implemented is a defect, not an exception.

---

## 2. Active Exceptions Register

| Exception ID | Date Added | Risk Category | Description | Rationale | Compensating Controls (verified) | Review Date | Owner / Status |
|---|---|---|---|---|---|---|---|
| **EXC-001** | 2026-10-26 (rewritten 2026-11-14) | Local persistence | Runtime state is a single-node SQLite database at `.garda/garda.db` rather than PostgreSQL | The product is a single-operator synthetic demonstration; a zero-dependency local database keeps setup to `npm run api` | (a) `.garda/` is gitignored, so no ledger or key is ever committed; (b) the audit table rejects `UPDATE`/`DELETE` via SQLite triggers (`audit_entries_no_update`, `audit_entries_no_delete` — verified by command, both `RAISE(ABORT)`); (c) entries are HMAC-SHA256-chained with a key held outside the database at `.garda/audit-secret.key` (mode 0600); (d) `GET /api/audit-trail/verify` detects an entry rewritten after its trigger was dropped; (e) the file is created with a 0700 data directory | 2026-11-30 | Lead Architect / **Approved — development only** |
| **EXC-003** | 2026-11-14 | Authentication scope | Three seeded demo operators (`analyst-demo-03` L2, `analyst-demo-01` L3, `auditor-demo-02` L3) with no user-management, MFA or password-reset flow | The build must be demonstrable without an identity provider | (a) the demo password is generated at first boot into `.garda/demo-credentials.txt` (0600) or supplied via `GARDA_DEMO_PASSWORD`; (b) generation is **refused** when `GARDA_ENV=production`; (c) `/signup`, `/forgot-password`, `/reset-password` and `/verify-email` are visibly non-functional and never claim success; (d) sessions are HttpOnly, SameSite=Lax, server-revocable and TTL-bounded; (e) only a SHA-256 of the token is stored | 2026-12-31 | Lead Architect / **Approved — development only** |
| **EXC-004** | 2026-11-14 | Rate limiting | The rate limiter is an in-process fixed window (`security._RateLimiter`), not a shared store | No Redis or equivalent exists in this stack | (a) limits are enforced per client+scope and return 429 with `Retry-After`; (b) all request strings are length-bounded and the ledger is paginated, so a single request cannot cause unbounded growth; (c) the API binds to `127.0.0.1` in the documented run command | 2026-12-31 | Lead Architect / **Approved — development only** |
| **EXC-005** | 2026-11-14 | Integrity assurance | The HMAC ledger chain is not externally notarised and provides no proof against whole-file replacement by someone holding the key | External notarisation is out of scope for a synthetic prototype | (a) the chain is described accurately in the UI, in the API `note` field, and in `SECURITY.md` — never as "immutable", "tamper-proof" or "certified"; (b) the key lives outside the database and is never returned by any endpoint | 2026-12-31 | Lead Architect / **Approved — development only** |

---

## 3. Withdrawn Exceptions

| Exception ID | Withdrawn | Reason |
|---|---|---|
| **EXC-002** | 2026-11-14 | It accepted a risk for an "AI provider fallback stub" that had never been written. There is no AI provider and no stub; candidate rationales are authored fixture prose, labelled as such in the UI. When the provider is implemented, the fallback path will be specified in a new exception or in the implementation itself. |

---

## 4. Retired / Resolved Findings

| Finding | Resolved | Evidence |
|---|---|---|
| No authentication or authorization on any API route (audit finding B-1) | 2026-11-14 | `security.require_session` on all `/api/*`; 401 asserted in `apps/api/tests/test_api.py` |
| Audit trail was an in-process list described as immutable (B-2) | 2026-11-14 | SQLite + append-only triggers + HMAC chain + `/api/audit-trail/verify` |
| Safety invariants bypassable with whitespace/casing/unknown strategy (D1, D2) | 2026-11-14 | `normalize()`, `Literal` strategy codes, `UnmodelledStrategyError`; `STRAT-A ` and `STRAT-Z` now return 422 |
| Client could self-assert an approval for a policy-blocked strategy (H-3) | 2026-11-14 | Server-side gate returns **403** for `VIOLATION_BLOCKED` |
| No input bounds, no pagination, no rate limiting (D5, D6) | 2026-11-14 | `Field(max_length=…)`, `limit`/`offset`, `security.rate_limit` |
| Stored XSS / log injection through audit fields (D4) | 2026-11-14 | Schema bounds + `_clean_text`; control characters are stripped |
