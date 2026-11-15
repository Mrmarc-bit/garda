# THREAT_MODEL.md — GARDA-SIM AI
## Threat Model and Risk Assessment

**Document Status:** Baseline v1.1 — verification statuses re-baselined against the code on 2026-11-14
**Last Reviewed:** 2026-11-14
**Governing Documents:** `SECURITY.md`, `PRD.md`, `ARSITEKTUR.md`, `IMPLEMENTATION_STATUS.md`
**Methodology:** STRIDE / OWASP Top 10 / OWASP API Security Top 10

> **Verification legend.** `Verified` = a command or a test in this repository demonstrates the control. `Partially verified` = the control exists but a stated sub-property is not exercised. `Not applicable yet` = the threatened component does not exist, so the control has not been built. Nothing in this document is marked "Implemented" without a code path that can be pointed at.

---

## 1. System Overview & Trust Boundaries

GARDA-SIM AI is a defensive cybersecurity decision-support web application that runs incident-response simulations over a synthetic dataset.

### 1.1 Trust Zones (as built)

1. **Untrusted zone:** public internet, browsers, unauthenticated users.
2. **Semi-trusted zone:** authenticated operators/reviewers — today three seeded demo operators holding an HttpOnly session cookie. There is no JWT and no OIDC.
3. **Application control plane:** Next.js web app (App Router + middleware) and the FastAPI service.
4. **Deterministic core:** `apps/api/src/simulation_engine.py` and `apps/api/src/safety_engine.py`.
5. **Data plane:** a single SQLite database at `.garda/garda.db` (`operators`, `sessions`, `audit_entries`). There is no PostgreSQL adapter.
6. **External zone:** *nothing.* No AI provider, no telemetry connector, no outbound HTTP client exists in `apps/api/src`.

### 1.2 Non-Negotiable Boundary Constraints

- **Zero real-world execution.** `apps/api/src` contains no shell, `eval`, socket, outbound HTTP client, or containment executor. No code path resolves a real hostname or modifies an external system.
- **Safety enforcement independence.** `DeterministicSafetyEngine` is pure: primitives in, verdict out. It has no framework, transport, database or AI coupling. AI output cannot exist in the decision path because no AI provider is wired in.
- **Input neutralisation.** Every request body is a Pydantic `StrictModel` (`extra="forbid"`, bounded strings). Scenario and asset identifiers are resolved against the synthetic inventory before use (`apps/api/src/validation.py`), and audit text is passed through `_clean_text`.

---

## 2. STRIDE Threat Analysis

| Threat ID | STRIDE | Threat | Affected component | Risk | Compensating controls (as built) | Verification status |
|---|---|---|---|---|---|---|
| **TM-01** | Spoofing | An unauthorised user assumes an operator or auditor identity | Auth service, session handler | High | HttpOnly + SameSite=Lax session cookie; only a SHA-256 of the token is stored; server-side revocation on logout; TTL from `GARDA_SESSION_TTL_MINUTES`; PBKDF2-HMAC-SHA256 (210 000 iterations) with per-user salt; login takes a constant-work path for unknown operators; `operator_id`/`reviewer_id` removed from request bodies so identity cannot be claimed in a payload | **Verified** — 401 for 7 reads and both writes, forged token rejected, cookie attributes asserted, revoked/expired sessions do not resolve (`apps/api/tests/test_api.py`, `test_storage.py`) |
| **TM-02** | Tampering | Malicious alteration of scenario definitions, topology, seeds or ledger entries | API endpoints, database | High | Pydantic v2 validation; parameterised SQLite access only; ledger `UPDATE`/`DELETE` rejected by triggers; HMAC chain over `prev_hash ‖ canonical_json` | **Verified** — `UPDATE`/`DELETE` raise "append-only"; after a forced rewrite the verify endpoint returns `verified: false` with the broken sequence |
| **TM-03** | Repudiation | An operator approves a response or changes state without a record | Audit service | Medium | Every simulation, review, refusal and note appends to the ledger with actor, timestamp, resource, result; refusals are recorded as `STRATEGY_REVIEW_REFUSED` rather than dropped | **Verified** — browser pass showed the new `STRATEGY_REVIEW` and `POLICY_INVARIANT_EVAL` entries; 96 backend tests assert the append behaviour |
| **TM-04** | Information disclosure | API keys, prompts, stack traces or tokens leaking into client bundles or error responses | Web frontend, API error handlers | Critical | No secret is read by the frontend; only `NEXT_PUBLIC_API_BASE` is exposed and it is a URL; FastAPI returns structured `detail` messages, never tracebacks; `/docs`, `/redoc` and `/openapi.json` are disabled when `IS_PRODUCTION`; `Cache-Control: no-store` on API responses | **Verified** — the six-domain audit found no stack trace or secret in any response; production build inspected |
| **TM-05** | Denial of service | Resource exhaustion through large payloads, unbounded lists or request floods | Simulation engine, API | Medium | `Field(max_length=…)` on every request string; ledger pagination `limit ≤ 200`; per-client+scope rate limiting with `Retry-After`; API binds to `127.0.0.1` in the documented run command | **Partially verified** — payload bounds, pagination and 429 behaviour are tested; the limiter is per-process and does not coordinate across workers (`SECURITY_EXCEPTIONS.md` EXC-004) |
| **TM-06** | Elevation of privilege | A lower-privileged operator performs a restricted action, or a client bypasses a safety constraint | AuthZ dependencies, safety engine | Critical | `security.require_clearance` (403 below `MIN_OPERATOR_CLEARANCE`); the safety engine is invoked **server-side** and its verdict is authoritative; the review endpoint returns **403** when a decision would approve a `VIOLATION_BLOCKED` strategy; `normalize()` defeats whitespace/casing/zero-width variants; unknown strategies are rejected (422) rather than scored; an unverified ledger chain fails SEC-OT-05 | **Verified** — `STRAT-A ` / `strat-a` / `STRAT-Z` → 422; approving `STRAT-A` → 403; low-clearance operator → 403; `audit_chain_verified=False` → `VIOLATION_AUDIT_INTEGRITY` |
| **TM-07** | Prompt injection | An adversary embeds instructions in evidence fields to manipulate an AI explanation | AI adapter | High | **No AI provider exists.** Candidate rationales are authored fixture text, labelled in the UI as "synthetic fixture, no model connected". The design constraint that AI is explanation-only and cannot change a SEC-OT verdict is recorded in `IMPLEMENTATION_STATUS.md` §7 as a requirement for the future adapter | **Not applicable yet** — the component is absent; the control must be built with the adapter |

---

## 3. High-Priority Risk Register

1. **Risk 1 — Accidental perception of real system control.**
   *Impact:* an operator believes a simulation action isolates a real host.
   *Mitigation (implemented):* persistent `SIMULATION ONLY` badge in every authenticated header; `simulation_only: true` in `/health`; the simulator states "Every asset in this scenario is virtual. The engine never resolves a hostname, opens a socket or issues a containment command."; no production credentials, connectors or containment code exist anywhere in the tree.
   *Residual:* a reader who ignores the badge cannot be prevented from misreading a modelled downtime figure as a real measurement.

2. **Risk 2 — Fabricated evidence or metrics presented as measured.**
   *Impact:* a user relies on numbers the deterministic engine never computed.
   *Mitigation (implemented in this pass):* the fabricated benchmark table, the fake ping probe, the `|| 1` dashboard floors and every "Tamper-Verified"/"SHA-256 signed" claim were removed. `/app/experiments` now measures real round-trip latency and explicitly declares containment/blast-radius accuracy `not_measured`. `/app/audit-trail` reports the actual chain-verification result and states that a chained hash is not external notarisation.
   *Residual:* modelled benefit/downtime values are profile constants from the fixture; they are labelled as modelled, not measured.

3. **Risk 3 — Ledger integrity overclaimed.**
   *Impact:* a reviewer treats the audit trail as externally notarised evidence.
   *Mitigation:* `SECURITY.md`, `SECURITY_EXCEPTIONS.md` EXC-005, the API `note` field and the audit-trail UI all state the same limit: the chain detects modification or deletion of an earlier entry in this database, provided the key is uncompromised; it does not prove the whole file was never replaced.

4. **Risk 4 — Real data introduced without the prerequisites.**
   *Impact:* a synthetic-only boundary is silently crossed.
   *Mitigation:* there is no ingestion path at all (grep for `ingest|connector|webhook|etl|poller|scraper` returns zero application matches), so real data cannot be loaded by accident. `IMPLEMENTATION_STATUS.md` §5 lists the five prerequisites that must land before real data is permitted.
