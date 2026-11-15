# DECISIONS.md — GARDA-SIM AI
## Architectural, Design, Security, and Scope Decision Log

**Project:** GARDA-SIM AI — AI-Assisted Cyber Defense Response Simulator  
**Last Updated:** 2026-11-14

---

### ADR-001: Baseline Technology Stack Selection
- **Status:** Approved (2026-10-26)
- **Decision:** Use Next.js App Router (TypeScript, Tailwind CSS, Radix UI/shadcn/ui primitives, Lucide Icons) for the web application, with a Python/FastAPI analytics service for deterministic simulation and safety policy enforcement.
- **Rationale:** Strictly aligns with `ARSITEKTUR.md` Section 2. Next.js App Router enables high-performance server rendering and clean responsive routing matching all 60 Figma screen exports. Python provides robust, deterministic graph analysis and analytical simulation.
- **Reference:** `TECH_STACK_DECISION.md`

### ADR-002: Source of Truth Hierarchy and Visual Contract
- **Status:** Approved (2026-10-26)
- **Decision:** The 60 Figma UI PNG exports in `docs ui` govern visual layout, hierarchy, and tokens. In case of visual discrepancies, the specific Figma frame takes precedence over generic text descriptions in documentation.
- **Rationale:** Prevents generic AI templates, unwanted purple gradients, neon borders, and arbitrary redesigns.
- **Reference:** `AGENTS.md`, `DESIGN.md`, `ROUTE_INVENTORY.md`, `DESIGN_HANDOFF.md`

### ADR-003: Deterministic Safety and Simulation Independence from AI
- **Status:** Approved (2026-10-26)
- **Decision:** Deterministic safety policy rules and simulation metrics calculation are executed strictly in deterministic code (Python/Pydantic). AI models (LLMs) are restricted to explanation, evidence summarization, and uncertainty communication.
- **Rationale:** Safety rules must be 100% reproducible and testable. AI cannot be permitted to override safety constraints or fabricate authoritative metrics.
- **Reference:** `PRD.md`, `SECURITY.md`, `THREAT_MODEL.md`

### ADR-004: Consistent Synthetic Incident and Topology Fixtures
- **Status:** Approved (2026-10-26)
- **Decision:** Standardize on a single synthetic reference scenario across all screens: Incident `INC-2026-0042` ("Suspicious Privilege Escalation") on asset `APP-GW-02`, connected to virtual assets `IDENTITY-SVC-01`, `MONITOR-01`, `OPS-DASH-01`, `OT-CONTROLLER-SIM-01`, and `TELEMETRY-SIM-01`.
- **Rationale:** Eliminates mock data dissonance across the dashboard, simulator, digital twin, and recommendations views.
- **Reference:** `DESIGN.md` Section 10

### ADR-005: Persistent `SIMULATION ONLY` Boundary Indicator
- **Status:** Approved (2026-10-26)
- **Decision:** All authenticated navigation shells must permanently display the `SIMULATION ONLY` badge.
- **Rationale:** Enforces clear operational safety boundaries; ensures users and evaluators understand no real-world containment or live production commands are being executed.
- **Reference:** `AGENTS.md` Section 6, `SECURITY.md`

---

## Remediation decisions (2026-11-14)

These were made while fixing the defects found by the six-domain audit. They are recorded because each one closes off an alternative that a future contributor might otherwise re-introduce.

### ADR-006: Session cookies instead of client-held tokens
- **Status:** Approved (2026-11-14)
- **Decision:** Authentication is an HttpOnly, SameSite=Lax, `Path=/` session cookie named `garda_session`. The server stores only a SHA-256 hash of the token. No token is ever placed in `localStorage`, and the API ignores an `Authorization: Bearer` header.
- **Rationale:** The previous build used `localStorage["garda_authenticated"] = "true"` as its only "auth", which is a client-side flag and explicitly forbidden by `AGENTS.md` §5. A cookie that JavaScript cannot read removes the XSS token-theft path and makes server-side revocation possible.
- **Alternative rejected:** JWT in `localStorage` — not revocable without a server-side denylist, which is a session store with extra steps.
- **Reference:** `apps/api/src/security.py`, `apps/web/src/middleware.ts`, `SECURITY.md` §7

### ADR-007: Identity comes from the session, never from the payload
- **Status:** Approved (2026-11-14)
- **Decision:** `operator_id` and `reviewer_id` were **removed** from `SimulationRequestSchema` and `ReviewRequestSchema`. All request models inherit `StrictModel(extra="forbid")`, so a payload that includes them is a 422.
- **Rationale:** The old API trusted `operator_id` from the body, so `"analyst-"` satisfied SEC-OT-02 and `reviewer_id: "hacker-01"` was written into the audit trail as the actor. A field that the client can set and the server trusts is not an identity.
- **Reference:** `apps/api/src/schemas.py`, `apps/api/src/main.py`

### ADR-008: SQLite with append-only triggers and an HMAC chain (not PostgreSQL, not "immutable")
- **Status:** Approved (2026-11-14) — temporary, tracked as EXC-001
- **Decision:** Persist to a single SQLite file at `.garda/garda.db`. Make `audit_entries` append-only with `BEFORE UPDATE`/`BEFORE DELETE` triggers that `RAISE(ABORT)`, and chain each entry with `HMAC-SHA256(key, prev_hash ‖ canonical_json)` using a key stored outside the database. Describe the result as **append-only and tamper-evident**, never as immutable.
- **Rationale:** The previous "immutable audit trail" was a Python list that vanished on restart, and its "hash" was `uuid.uuid4().hex[:12]`. Storage-level enforcement plus a keyed chain is a real control that can be demonstrated by command; PostgreSQL would add a service dependency without adding tamper evidence.
- **Consequence:** Single node, no replication, no migrations framework. Real data requires the move to PostgreSQL (`IMPLEMENTATION_STATUS.md` §5).
- **Reference:** `apps/api/src/storage.py`, `SECURITY_EXCEPTIONS.md` EXC-001 and EXC-005

### ADR-009: Fail closed on anything unmodelled
- **Status:** Approved (2026-11-14)
- **Decision:** An unknown strategy code is a 422, not a default profile. An unknown scenario, an asset outside the inventory, or an asset outside the scenario's scope is a 400. An unverifiable ledger chain fails SEC-OT-05. There is no "custom candidate" fallback.
- **Rationale:** The old engine invented a `"Custom Candidate"` with a score of 50 and a passing gate for any unrecognised string, which meant a typo produced a plausible-looking safety verdict. A policy engine that guesses is worse than one that refuses.
- **Reference:** `apps/api/src/validation.py`, `apps/api/src/simulation_engine.py`, `apps/api/src/safety_engine.py`

### ADR-010: The safety engine receives facts, not self-certifications
- **Status:** Approved (2026-11-14)
- **Decision:** `DeterministicSafetyEngine.evaluate(*, strategy_code, target_asset, operator_id, operator_clearance, audit_chain_verified, strict_ot_mode=True)` — `operator_clearance` and `audit_chain_verified` are **required keyword arguments with no default**. `strict_ot_mode` is a server-side config value, not a UI toggle.
- **Rationale:** The old signature let a caller assert its own clearance and its own audit status, and "Strict OT Mode" was a `localStorage` switch the server never saw. Required facts force the route handler to obtain them from the session and the ledger.
- **Reference:** `apps/api/src/safety_engine.py`, `apps/api/src/config.py`

### ADR-011: Failures are rendered as failures, everywhere
- **Status:** Approved (2026-11-14)
- **Decision:** No API helper falls back to a local fixture. `ApiError` is thrown, pages render an explicit error state, and no page substitutes placeholder numbers. A failed export, review or note write reports the failure and writes nothing.
- **Rationale:** The old client returned the local synthetic array on any network error, so an outage was indistinguishable from success; the recommendations page's `catch` branch wrote the requested decision into state, so a failed request rendered as an approved strategy. That is the single most dangerous class of bug in a decision-support tool.
- **Reference:** `apps/web/src/lib/api-client.ts`, `AGENTS.md` §6 ("Preserve failures as failures")

### ADR-012: Fabricated measurements are deleted, not relabelled
- **Status:** Approved (2026-11-14)
- **Decision:** Where a number had no computation behind it, the feature was removed rather than annotated: the benchmark table, the ping probe, the activity chart, the `|| 1` metric floors. Where a real measurement was possible (round-trip latency), it replaced the fabricated one. Where no ground truth exists (containment accuracy, blast-radius accuracy), the value is reported as `not_measured`.
- **Rationale:** A disclaimer under a fabricated number does not fix a fabricated number. `AGENTS.md` §4 forbids inventing metrics, and `PRD.md` FR-AUD-03 forbids asserting integrity without a mechanism.
- **Reference:** `apps/web/src/app/app/experiments/page.tsx`, `apps/web/src/app/app/digital-twin/page.tsx`, `apps/web/src/app/app/page.tsx`

### ADR-013: Middleware is a redirect layer, not the authorization boundary
- **Status:** Approved (2026-11-14)
- **Decision:** `apps/web/src/middleware.ts` redirects unauthenticated navigation away from `/app…` and authenticated navigation away from `/login`/`/signup`. It is documented in code and in `ROUTE_INVENTORY.md` §4 as a UX layer only; the API's `require_session` dependency is the boundary.
- **Rationale:** The Edge runtime cannot reach SQLite, so middleware cannot validate a session. Treating it as authorization would recreate the original defect (a check that looks like a gate but isn't) in a new place.
- **Reference:** `apps/web/src/middleware.ts`, `ROUTE_INVENTORY.md` §4
