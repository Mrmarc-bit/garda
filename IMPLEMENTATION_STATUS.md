# IMPLEMENTATION_STATUS.md — GARDA-SIM AI
## Master Implementation, Verification, and Progress Tracking

**Current Phase:** Milestone 4 complete — deterministic safety engine is authoritative, authenticated and persistent. Milestone 5 (AI provider) not started.
**Last Updated:** 2026-11-14
**Governing Documents:** `PRD.md`, `DESIGN.md`, `ARSITEKTUR.md`, `SECURITY.md`, `AGENTS.md`

> **Honesty rule for this document.** Every "Verified" claim below is backed by a command that was actually run in this repository, or by a code path that can be pointed at. Claims that were previously listed here without code behind them have been removed or moved to §7 Known Limitations. If a feature is not implemented, this document says so.

---

## 1. Summary Status Dashboard

| Phase / Milestone | Status | What actually exists | Blockers / Risks | Verification gate |
|---|---|---|---|---|
| **M0: Audit & Governance** | Verified | Repository audit, Figma inventory (60 PNGs), 10 governance documents | None | Documents exist and are reviewed |
| **M1: Foundation & Design System** | Verified | Next.js App Router scaffold, Tailwind tokens, primitives, shell layout, persistent `SIMULATION ONLY` badge, landing page, `/app` overview | None | `tsc --noEmit` exit 0, `next build` 31 routes |
| **M2: Core Screens** | Verified | 31 routes implemented; 14 authenticated `/app/*` routes render real API data | Screens are functional, not pixel-diffed against Figma (no automated screenshot comparison in the repo) | `next build` prerenders 31 routes |
| **M3: Backend, Auth & Persistence** | Verified | FastAPI service, Pydantic v2 schemas, SQLite persistence, session-cookie authentication, security headers, rate limiting | Single-node SQLite; no PostgreSQL adapter | `pytest apps/api/tests` → 101 passed |
| **M4: Simulation & Safety Engine** | Verified | `DeterministicSimulationEngine` + `DeterministicSafetyEngine` enforcing SEC-OT-01…05 **server-side**, fail-closed, with a server-side approval gate | Invariants are string/inventory based over a *fixed synthetic* dataset; they are not a general OT policy engine | 96 backend tests incl. bypass cases |
| **M5: AI Explanation** | **Not implemented** | Nothing. No provider, no SDK, no key handling. Candidate rationales are authored fixture text | PRD §6.7 FR-AI-01…07 are P0 and unmet | n/a |
| **M6: Experiments, Audit & Export** | Partially verified | Audit ledger is real (SQLite + append-only triggers + HMAC chain + verify endpoint). Reports export real API data. Experiments harness measures real round-trip latency | Containment accuracy / blast-radius accuracy are **not** measured — no ground truth exists | 96 backend tests; browser pass |
| **M7: Release Readiness** | **Not ready for production** | Production build passes; single-operator demo is end-to-end functional | No MFA, no multi-tenancy, no PostgreSQL, no external notarisation, no AI provider, no live ingestion | See §7 |

---

## 2. What was actually fixed in this pass

The previous version of this document claimed seven "Verified" milestones while the underlying code did not support them. A six-domain audit (security architecture, application security, software architecture, code review, API testing, browser automation) produced the defect list below. All items marked **Fixed** were changed in this pass and are covered by tests or by a live browser/HTTP check.

### 2.1 Authentication and authorization (was: none)

| Defect | Status | Evidence |
|---|---|---|
| All 8 API routes were unauthenticated; `curl` could enumerate incidents, run simulations, approve strategies and read the ledger | **Fixed** | `security.require_session` on every read/write; `apps/api/tests/test_api.py` asserts 401 for 7 reads + both writes |
| No session concept at all | **Fixed** | `POST /api/auth/login` issues an HttpOnly, SameSite=Lax, `Path=/` session cookie; token stored as SHA-256 hash only (`storage.create_session`) |
| Operator identity supplied by the client (`operator_id: "analyst-demo-03"` hardcoded in the browser) | **Fixed** | `operator_id`/`reviewer_id` removed from `SimulationRequestSchema`/`ReviewRequestSchema`; `StrictModel(extra="forbid")` makes a client-supplied identity a 422 |
| No clearance check | **Fixed** | `security.require_clearance` returns 403 below `config.MIN_OPERATOR_CLEARANCE` (default 2) |
| `/app/*` rendered for anyone | **Fixed (redirect layer)** | `apps/web/src/middleware.ts` redirects to `/login?next=…` without a session cookie. This is **not** the authorization boundary — the API resolves the session and returns 401 |
| No CSRF / origin control | **Fixed** | `security.require_trusted_origin` returns 403 on a disallowed `Origin` for state-changing calls |

### 2.2 Deterministic safety engine (was: defeatable by a trailing space)

| Defect | Status | Evidence |
|---|---|---|
| `"STRAT-A "`, `"strat-a"`, `"STRAT-A\u200b"`, `"STRAT-A\t"` all bypassed SEC-OT-04 and returned a **passing** verdict with a fabricated score of 50 | **Fixed** | `normalize()` (NFKC + zero-width/control strip + whitespace collapse + upper) in `apps/api/src/safety_engine.py`; `STRATEGY_BY_CODE` is now the only source of profiles |
| Unknown strategy codes silently produced `"Custom Candidate"`, 50% benefit, 30 min downtime, `PASSED` | **Fixed** | `DeterministicSimulationEngine.profile_for` raises `UnmodelledStrategyError`; the schema uses `Literal["STRAT-A","STRAT-B","STRAT-C"]` → 422 |
| SEC-OT-01 matched a **prefix allowlist** (`APP-GW*`), so `APP-GW-REAL-PROD-77` passed | **Fixed** | Membership test against `SYNTHETIC_ASSET_IDS` |
| SEC-OT-02 was `operator_id.startswith("analyst-")`, so `"analyst-"` passed | **Fixed** | Requires a registered operator row at clearance ≥ minimum; clearance arrives as a required keyword fact from the session |
| SEC-OT-03 was a literal string compare | **Fixed** | `PROTECTED_ASSET_IDS` check on both target and the strategy's modelled affected assets |
| SEC-OT-04 only inspected `strategy_code == "STRAT-A"` | **Fixed** | Decided from the strategy's modelled affected assets ∩ `TELEMETRY_CRITICAL_ASSET_IDS`; unmodelled strategy fails closed |
| SEC-OT-05 was an unconditional `"PASSED"` | **Fixed** | Verifies the HMAC ledger chain via `storage.verify_chain()`; a caller cannot self-certify because `audit_chain_verified` is a required keyword argument |
| `evaluated_rules` returned partial results on early return (1 or 4 keys) | **Fixed** | All five verdicts are always populated |
| Scenario / asset referential integrity was never checked (`INC-FAKE-9999`, `'; DROP TABLE audit; --`, `APP-GW/../../etc/passwd` all returned 200) | **Fixed** | `apps/api/src/validation.py`: `resolve_scenario`, `resolve_asset` (inventory + `SCENARIO_ASSET_SCOPE`) → 400 with `{field, message}` |

### 2.3 Audit ledger (was: an in-process list described as immutable)

| Defect | Status | Evidence |
|---|---|---|
| `_audit_trail` was a module-level Python list — wiped on restart, described in a code comment as "immutable" | **Fixed** | SQLite `audit_entries` table in `.garda/garda.db` |
| `insert(0, …)` (prepend) while the comment said "append" | **Fixed** | Monotonic `seq`, `append_audit` only |
| "Integrity hash" was `uuid.uuid4().hex[:12]` on the review path and a truncated 12-char SHA-256 on the simulate path | **Fixed** | `entry_hash = HMAC-SHA256(key, prev_hash ‖ canonical_json)`, 64 hex chars, chained via `prev_hash` with `GENESIS_HASH` |
| No tamper resistance | **Fixed** | SQLite triggers `audit_entries_no_update` / `audit_entries_no_delete` `RAISE(ABORT)`; verified live: `UPDATE … → "audit_entries is append-only: UPDATE rejected"` |
| Tampering undetectable | **Fixed** | `GET /api/audit-trail/verify` → `{verified, checked_entries, broken_seq, algorithm, note}`. Verified live: after `DROP TRIGGER` + `UPDATE`, `verified` became `false` with `broken_seq: 2` |
| Unbounded growth, no pagination, 5 MB field accepted | **Fixed** | `limit` 1…200 / `offset`; `Field(max_length=…)` on every string; `_clean_text` strips non-printables |
| Stored XSS / log injection via `details` and `actor` | **Fixed** | Input is schema-bounded and `_clean_text`-sanitised before append |
| Seeded entries indistinguishable from runtime entries | **Fixed** | `is_synthetic` flag, rendered as a `SYNTHETIC` marker in the UI |
| No rate limiting (200 concurrent writes, zero 429s) | **Fixed** | Fixed-window limiter per client+scope (`security.rate_limit`) → 429 + `Retry-After` |

### 2.4 Fabricated measurements and false assurance claims removed

| Surface | Was | Now |
|---|---|---|
| `/app/experiments` | `setTimeout` returning hardcoded 94/65/88 containment, 45/30/0 min, 1/3/0 violations, `multiplier = repetitions === 50 ? 1.05 : 1.0` | Real loop of `POST /api/simulate` with `performance.now()` latency samples; benefit/downtime are labelled **modelled profile values**; containment accuracy explicitly declared `not_measured` |
| `/app/digital-twin` "Ping Virtual Node" | `setTimeout` → `rtt "1.4 ms"`, `loss "0.0%"`, always PASS | Removed. Replaced by a dependency-trace toggle that states "Computed locally from the API topology. No network probe was issued." |
| `/app` dashboard | `incidents.length \|\| 1`, `criticalIncidentsCount \|\| 1`, `atRiskCount \|\| 2`, a hardcoded 4-bar activity chart, a hardcoded topology list | Real counts; `—` while loading or on error; charts/lists rendered from API data |
| `/app/audit-trail` | "TAMPER VERIFIED", "SHA-256 Verified", hash = `log.id.replace("AUD-","HASH-") + "A9"` | "Chain verified" / "Chain broken at sequence N" from `GET /api/audit-trail/verify`; full 64-char `entry_hash` and `prev_hash` displayed with an explicit caveat that a chained hash is not external notarisation |
| `/app/reports` | "Integrity: Tamper-Verified", "Exportable with SHA-256 signatures", "3 Evidence Records" | Real `auditPage.total`, chain result + `chain.note`, `evidence.length` |
| `/app/recommendations` | The `catch` branch wrote the requested decision into state, so a **failed** request rendered as an approved strategy | Failure sets an error banner and writes nothing |
| `/app/incidents/[id]` | "Save to Ledger" wrote `localStorage["garda_note_<id>"]` while claiming cryptographic linkage | `POST /api/incidents/{id}/notes` appends to the ledger and returns the real `audit_id` |
| `/app/settings` | Save button + `setTimeout` fake success, writing `garda_*` keys nothing reads | Server-resolved facts only (`/api/auth/me`, `/health`); sign-out calls the API; no browser storage |
| `/app/notifications` | 3 hardcoded cards | Feed derived from the ledger |
| `/app/profile` | "Profile successfully updated" / "Credentials updated in local keystore" with no endpoint | Read-only identity + an explicitly **disabled** "Update credentials — not implemented" control |
| Landing / marketing copy | `"Claude-3.5-Sonnet-Specimen"` model specimen; `EV-0042-01…03` at 09:14/09:15 | `NOT_CONNECTED / authored_fixture`; real fixture ids `EVD-101/102/103` at 14:10:12/14:11:05/14:11:42 |

### 2.5 Dataset and route consistency

| Defect | Status |
|---|---|
| The dataset existed in three drifted copies (Python fixtures, `synthetic-data.ts`, and a third `RECOMMENDATIONS` array inside `recommendations/page.tsx`) | **Fixed** — the third copy is deleted; pages read the API |
| `EVD-102` had `bytes: 1420` in TS only; `EVD-103` had `geo_variance` in TS only | **Fixed** — both removed; TS fixtures now match the backend |
| `/app/evidence` dropped `EVD-104`; `/app/reports` said 3 evidence records vs the API's 4 | **Fixed** — all four records are rendered from `GET /api/evidence` |
| `/app/incidents/[id]` Evidence tab and Timeline tab used contradictory timestamps for the same IDs | **Fixed** — both tabs render one filtered `scenarioEvidence` memo |
| `/app/simulator` rendered a hardcoded five-rule list instead of `evaluated_rules` | **Fixed** — renders the API verdicts, including `VIOLATION_*` |
| `/app/simulator` had an unused `?asset=` deep link from the digital twin | **Fixed** — the twin links with `?incident=<id>` |

### 2.6 Build and accessibility

| Defect | Status | Evidence |
|---|---|---|
| **Production build failed**: `useSearchParams() should be wrapped in a suspense boundary at page "/app/simulator"` | **Fixed** | `SimulatorView` (which calls `useSearchParams`) is wrapped in `<Suspense>`; `next build` now completes |
| No `loading.tsx` / `error.tsx` anywhere | **Fixed** | `apps/web/src/app/app/loading.tsx`, `apps/web/src/app/app/error.tsx` |
| No reduced-motion handling outside Lenis | **Fixed** | `@media (prefers-reduced-motion: reduce)` block in `globals.css` |
| Clickable `<div>`/`<tr>` rows unreachable by keyboard | **Fixed** on digital-twin, evidence, incidents, recommendations, audit-trail (real `<button aria-pressed>` / focus-visible outline) |
| Unlabelled inputs | **Fixed** on evidence, incidents, incidents/[id], settings, simulator, experiments |
| Tabs without `role="tab"` / `aria-selected` | **Fixed** on recommendations, reports, settings, profile, evidence, incidents/[id] |
| `as any` despite `strict` | **Fixed** in `components/ui/sidebar.tsx` and `components/ui/dropdown-menu.tsx` |
| Dead files: `sidebar-pattern.tsx` (528 lines, unimported), `simulation-badge.tsx` (never imported) | **Deleted** |

### 2.6b Per-feature functional verification (round 2, 2026-11-14)

Every authenticated view was driven in a real Chromium session (headless, CDP) with real clicks,
real form input and direct SQLite inspection, not by reading code. 45 of 46 interaction checks
passed; the single non-pass was the audit-trail "Older" button correctly reporting `disabled`
because a 20-entry ledger fits on one 25-row page.

| Defect found | Status | Evidence |
|---|---|---|
| Audit-trail paging label lied under a filter: 3 visible rows still read `Showing 1–25 of 58` | **Fixed** | `apps/web/src/app/app/audit-trail/page.tsx` gained `isFiltered`; the label now reads `${visible.length} matching of ${entries.length} on this page · ${total} in ledger`, and a `colSpan={5}` row distinguishes "ledger returned no entries" from "no entry on this page matches the active filters" |
| Notifications labelled every runtime ledger entry `SYNTHETIC SEED` although only the two seeded `AUD-SYN-*` rows are seeds | **Fixed** | label is now `SYNTHETIC DATA`; the empty state also branches on `loadError` first so a failed read never renders as "The ledger is empty." |
| Contact form reported "Inquiry Dispatched Successfully … logged to the research repository" with no backend | **Fixed** | the form now validates and composes the message, then states "Message prepared — not sent … nothing was transmitted or stored", with copy/edit actions |
| Landing and chrome copy used invented rule ids (`POL-01..03`, `SEC-AUTH-02`, `SEC-ENV-03`, `SEC-AUDIT-04`, `GATE_ENGINE v2.4`) | **Fixed** | all of it replaced by the real `SEC-OT-01..05`; `grep -rn "POL-0" apps/web/src` returns nothing |
| Command palette listed wrong facts and was mouse-only | **Fixed** | correct incident/asset entries incl. the previously missing `INC-2026-0043`, real `<button>` rows, `role="dialog" aria-modal="true"`, labelled input and close control |

Verified in the same round, all through the UI: login → `/app`; simulator run returning a real
`AUD-*` id and five server-evaluated invariants; approval of a `PASSED` strategy and refusal
(disabled control) of a `VIOLATION_BLOCKED` one, both writing ledger rows; rejection writing a
ledger row; the run harness issuing 15 real `POST /api/simulate` calls (ledger grew by 15);
audit-trail filter narrowing 20 rows to 3, paging, and the hash inspector; digital-twin node
selection and blast-radius mode over 6 assets and 6 dependency edges; evidence tabs and the
visible clipboard-refusal message; incident search and the `Simulate` deep link carrying
`?incident=`; settings safety/storage tabs; profile read-only credential state; the ledger-derived
notification feed; and all three report exports producing real files (JSON 32,875 B, MD 2,735 B,
CSV 707 B).

---

### 2.7 Developer setup surface (was: none)

| Defect | Status | Evidence |
|---|---|---|
| No `README.md` at all — no documented install, run, demo-credential or configuration path | **Fixed** | `README.md`: capability table with the not-implemented rows explicit, prerequisites, two-process run instructions, demo operator table, full configuration table, verification commands, storage layout, and the simulated-vs-real data position |
| No `.env.example` — 15 environment variables existed only as implicit defaults in `config.py` | **Fixed** | `.env.example` documents every `GARDA_*` variable with its default and the reason it exists; `.gitignore` still covers `.env`/`.env.local`/`.env.*.local` while leaving `.env.example` tracked |
| A running process kept signing new ledger entries with its cached HMAC key after the data directory was replaced underneath it, so it reported success while writing entries that could never verify | **Fixed** | `storage._audit_key()` now re-reads the key file on every append when no `GARDA_AUDIT_SECRET` is configured and raises `RuntimeError` if it no longer matches the cached key; covered by `test_replaced_key_file_blocks_further_appends` |
| Ledger file inherited only directory-level protection (0700 dir, 0644 file) | **Fixed** | `storage._harden_db_permissions()` re-chmods `garda.db`, `-wal` and `-shm` to 0600 on every `init_db()`; verified on a fresh boot |

### 2.8 Responsive layout: mobile and tablet (requested 2026-11-14)

Measured with a real Chromium session over CDP at five viewports — `375x812`,
`414x896`, `768x1024`, `1024x768` and `1440x900` — with touch emulation enabled
below 1024px, checking every page for horizontal overflow, controls under the
24x24 WCAG 2.5.8 floor (36px on touch) and text below 10px.

| Defect | Status | Evidence |
|---|---|---|
| Sidebar drawer consumed 256px of flex flow below `lg` because it was only hidden with `-translate-x-full`; `<main>` was squeezed to **119px on a 375px viewport** on every `/app` page | **Fixed** | `components/ui/sidebar.tsx`: the aside is `fixed … w-72` off-canvas below `lg` and `lg:static` with `lg:w-64`/`lg:w-[60px]`; `inert` and `aria-hidden` while closed; Escape now closes the drawer |
| Header right cluster (Search + `⌘K`, Notifications, Profile) rendered unconditionally, overflowing narrow viewports | **Fixed** | `components/layout/app-header.tsx`: icon-only 40px controls below `xl`, labels from `xl`; breadcrumb separators and intermediate crumbs hidden below `sm`; final crumb truncates |
| Content padding fixed at `p-6 md:p-8`, no `min-w-0` on the content column | **Fixed** | `components/layout/app-layout.tsx`: `p-3 sm:p-5 md:p-8`, inner `max-w-[1440px] mx-auto w-full min-w-0` |
| Digital-twin graph positioned in percentages, so node cards overlapped each other at 375px (11 offenders, widest 224px) | **Fixed** | Graph canvas is `min-w-[720px]` inside an `overflow-x-auto` wrapper with a `lg:hidden` scroll hint; zoom and view-mode controls are 36–40px on touch |
| Native `<select>`/`<input>` were 16–17px tall on touch devices | **Fixed** | `app/globals.css`: 40px form-control floor at `(max-width: 1023px), (pointer: coarse)` |
| Tab strips, toolbar text buttons, small-caption buttons and nav links were 15–30px tall | **Fixed** | `app/globals.css`: 44px `[role="tab"]`, 32px text buttons, 36px header/footer links, 24px universal floor at every viewport |
| Sidebar group/menu action buttons were 20–24px | **Fixed** | `data-sidebar="group-action"`/`"menu-action"` hooks plus a `@media (pointer: coarse)` rule |
| Simulator strategy cards were a clickable `<div>` with a 24px radio inside | **Fixed** | Card is now a `<label>` wrapping the radio, so the whole card is the tap target and `focus-within` draws the focus ring |
| Public pages had no `<main>` landmark, and the target-size floor was scoped to `main` only | **Fixed** | Floor is app-wide; FAQ categories and onboarding steps are real controls with a 40px box; FAQ categories are `role="tab"`/`aria-selected` |
| Only sub-10px text in the app (`v1.0` at 9px) | **Fixed** | `components/layout/app-sidebar.tsx` now 10px |
| Dense data tables (audit ledger, incident repository, experiment matrix) were `<table>` inside `overflow-x-auto`: at 390px only 310px of a 609px table was visible, so RESULT and ENTRY HASH were cut off and the reader had to scroll sideways to see one row | **Fixed** | `apps/web/src/app/app/audit-trail/page.tsx`, `incidents/page.tsx` and `experiments/page.tsx` now render a stacked card list below `md` (`md:hidden` `<ul>`) and the table from `md` up (`hidden md:block`). Measured after the change: audit and incident tables report width 0 at 390px (cards instead), and the reports key/value table fits at 310/310 with no clipping |

**Result: 130/130 viewport checks pass** — 13 `/app` routes and 13 public routes
× 5 viewports, with zero horizontal overflow, zero undersized controls and zero
sub-10px text. `npx tsc --noEmit` exit 0, 101 pytest passing, production build
succeeds (31 routes).

Note for anyone re-running this: Tailwind 3.4 has **no `pointer-coarse`
variant**; a `pointer-coarse:` utility silently emits nothing, so coarse-pointer
rules must be written as raw CSS media queries.

---

### 2.9 Navigation transitions and loading states (requested 2026-11-15)

Requested as: page transitions out of the dashboard were not smooth, there was no
shimmer, and the loading state looked poor. Three separate causes were measured,
not guessed.

| Defect | Status | Evidence |
|---|---|---|
| **The workspace shell was re-created on every navigation.** `apps/web/src/app/app/` had no `layout.tsx`, and all 13 pages wrapped their own content in `<AppLayout>`, so each client-side navigation unmounted and remounted the sidebar and header — the visible flash | **Fixed** | New `apps/web/src/app/app/layout.tsx` renders the shell once; the 13 pages now return fragments. Verified by tagging `aside.dataset.probe` and navigating: the attribute survived, so the shell was not remounted |
| No transition between routes at all | **Fixed** | `apps/web/src/app/app/template.tsx` applies a pure-CSS `.workspace-enter` (220ms, `cubic-bezier(0.22,1,0.36,1)`, opacity + 6px rise). A framer-motion `initial={{opacity:0}}` was tried first and **rejected**: it left the page invisible until hydration finished, so a slow load showed an empty workspace |
| No navigation feedback while a route loads | **Fixed** | `apps/web/src/components/layout/route-progress.tsx`: a 2px top bar driven by a capture-phase link click plus `usePathname` completion. Measured `{w:"22.76%", o:"1"}` 150ms after a click, `{w:"100%", o:"1"}` on completion, settling to `{w:"0%", o:"0"}` |
| Loading states were a spinner plus a sentence ("Loading simulator context from the deterministic engine…") with one `animate-pulse` block | **Fixed** | New `apps/web/src/components/ui/skeleton.tsx` (`Skeleton`, `SkeletonText`, `SkeletonCard`, `SkeletonCardGrid`, `SkeletonRows`, `SkeletonPage`); applied to `app/loading.tsx` and the in-flight state of the dashboard, simulator, audit trail, evidence, incidents, settings, profile and notifications pages |
| The audit-trail banner printed "Total Recorded Events: **0**" and "Chain verification unavailable" *while loading* — a false statement about a ledger that had not been read | **Fixed** | That banner now renders skeleton bars when `isLoading && chain === null && total === 0` |
| Shimmer invisible on first attempt: animating `background-position` repainted every frame and stayed too faint | **Fixed** | The sweep is a `transform`-animated `::after` band (`@keyframes garda-shimmer`), which is GPU-composited. Measured `matrix(1,0,0,1,20.2147,0)` mid-sweep |
| Placeholder blocks were *darker* than the card (`#1c1c1c` on `#252525`), so they read as holes punched in the panel | **Fixed** | `.skeleton-shimmer` base is `#343434`, i.e. lighter than the card, with a white 18%-peak band. Confirmed by screenshot at 1440x900 and 390x844 |
| The progress bar could stick at 90% forever: completion is keyed on `usePathname()`, but a link that changes only the query string (`/app/simulator?incident=…` clicked from the incident list) does not change the pathname | **Fixed** | `route-progress.tsx` gained a 4s watchdog that completes and hides the bar. Reading `useSearchParams()` instead would force every workspace page into a Suspense boundary for a decorative element. Measured: bar visible at 300ms after the click, hidden again at 1.15s |
| Audit ledger key replaced on disk under a running process returned **500** from `/api/audit-trail/verify` | **Fixed** | `storage.LedgerUnavailableError` plus an `@app.exception_handler` returning **503** with an actionable message; covered by `test_ledger_key_replacement_surfaces_as_503` |

**Result:** `npx tsc --noEmit` exit 0, **101 pytest passing**, production build
succeeds (31 routes), and the responsive sweep still reports **130/130** clean
after the layout restructure.

Note for anyone re-running this: a stale `apps/web/.next` will serve the *old*
stylesheet, so a CSS change can look broken when it is not. Kill `next dev` and
`next-server`, delete `.next`, restart, then assert `getComputedStyle(el).animationName`
and the `::after` `transform` before judging the result.

---

## 3. Tests and Commands Executed

All of the following were run in this working tree. Outcomes are the actual output.

| Command | Outcome | Purpose |
|---|---|---|
| `rm -rf .garda && PYTHONPATH=. ./apps/api/.venv/bin/pytest apps/api/tests -q` | **101 passed, 1 warning** (StarletteDeprecationWarning: httpx with `starlette.testclient`) | Backend: auth, safety invariants, validation, storage, chain verification, rate limiting |
| `npx --no-install tsc --noEmit -p apps/web/tsconfig.json` | **exit 0, no output** | TypeScript strict |
| `npm --workspace=@garda-sim/web run build` | **Success** — 31 routes prerendered, Middleware 34.2 kB, shared JS 103 kB | Production build (previously failed) |
| `curl` against the running API | `/health` 200 with `nosniff`, `DENY`, `no-referrer`, CSP, `no-store`; unauthenticated `/api/incidents` → 401; `STRAT-A ` → 422; approve `STRAT-A` → **403**; approve `STRAT-B` → 200 with `chain_verified: true` | Live security behaviour |
| `sqlite3 .garda/garda.db "UPDATE audit_entries …"` / `"DELETE …"` | `audit_entries is append-only: UPDATE rejected` / `DELETE rejected` | Append-only triggers |
| Tamper test (`DROP TRIGGER` + `UPDATE`) then `GET /api/audit-trail/verify` | `{"verified": false, "checked_seq": 2}` | Chain detects tampering |
| `curl -I http://127.0.0.1:3000/app/audit-trail` | `307 → /login?next=%2Fapp%2Faudit-trail` | Route protection |
| Responsive sweep (headless Chromium, CDP, touch emulation below 1024px) | **130/130 checks pass** — 26 routes × 5 viewports, no horizontal overflow, no control under 24x24 (36px on touch), no text under 10px | Mobile and tablet layout |
| Chromium pass over all 14 `/app` routes | All render; console clean (only React DevTools info + one favicon 404); simulator/review/note flows produce real ledger entries | End-to-end |
| Route sweep, anonymous | All 12 `/app/*` URLs → `307` to `/login?next=…`; all 16 public routes → `200` | Route protection covers every page |
| Route sweep, authenticated | All 12 `/app/*` URLs plus `/app/incidents/INC-2026-0042` → `200`; all 7 `/api/*` reads → `200` (and `401` anonymously) | Auth boundary is complete in both directions |
| `GARDA_ENV=production` subprocess probe | `app.docs_url app.redoc_url app.openapi_url` → `None None None` | Docs surface removed outside development |

**Test count history:** the suite was 15 tests at the start of this pass and is 99 now. The original 15 included no authentication, no bypass, no chain and no rate-limit coverage.

---

## 4. Security Status

Implemented and verified in code:

- **Server-side authorization.** Every `/api/*` read and write depends on `security.require_session`; state-changing calls additionally require `require_clearance` and `require_trusted_origin`.
- **Session handling.** HttpOnly, SameSite=Lax cookie; the server stores only a SHA-256 of the token; TTL from `GARDA_SESSION_TTL_MINUTES`; `logout` revokes server-side; expired and revoked tokens do not resolve.
- **Password storage.** PBKDF2-HMAC-SHA256, 210 000 iterations, per-user salt (`security.hash_password`). Login takes a constant-work path for unknown operators.
- **Deterministic policy is authoritative.** The safety engine runs server-side; AI text (when it exists) cannot override it. The review endpoint returns **403** when a decision would approve a `VIOLATION_BLOCKED` strategy.
- **Fail-closed.** Unknown strategy → 422. Unknown scenario / out-of-scope asset → 400. Unverified ledger chain → `SEC-OT-05` fails.
- **Append-only ledger.** SQLite triggers reject `UPDATE`/`DELETE`; entries are HMAC-chained with a key held outside the database (`.garda/audit-secret.key`, mode 0600). The data directory is created 0700 and the ledger file plus its WAL/SHM siblings are re-chmodded to 0600 by `storage._harden_db_permissions()` on every `init_db()`.
- **Docs surface gated by environment.** `/docs`, `/redoc` and `/openapi.json` are development-only; `GARDA_ENV=production` sets all three URLs to `None`. Asserted by `test_production_mode_removes_interactive_api_docs`, which runs the check in a subprocess so the reloaded config cannot leak into other tests.
- **Input bounds.** `Field(max_length=…)` on all request strings, `extra="forbid"`, bounded pagination, control characters stripped.
- **Transport / browser hardening.** CSP `default-src 'none'; frame-ancestors 'none'; base-uri 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Cache-Control: no-store`, HSTS in production, `X-Request-ID` correlation.
- **No production blast radius.** `apps/api/src` contains no shell, `eval`, outbound HTTP client, database connector to a real system, or containment executor. Nothing resolves a hostname or opens a socket to a real asset.
- **Secrets.** No credentials in source. `.gitignore` covers `.garda/`, `.env*`, `*.pem`, `*.key`. The demo password is generated at first boot into `.garda/demo-credentials.txt` (0600) and is never generated when `GARDA_ENV=production`.

---

## 5. Data Modes: simulated vs real

The user requirement was "ready for both real data and simulated data". The honest position:

**Simulated data — ready.** The synthetic dataset (`apps/api/src/synthetic_dataset.py`) is the single source of truth, is versioned with the code, and every screen labels it (`SIMULATION ONLY`, `SYNTHETIC`, `SYNTHETIC SEED`, "authored fixture").

**Real data — not ready.** There is no ingestion path. Grep for `ingest|connector|webhook|etl|poller|scraper` returns zero application matches. Moving to real data requires, at minimum:

1. A repository/DataSource seam so `synthetic_dataset` becomes one implementation rather than a module-level constant.
2. Schema and validation for untrusted evidence payloads (the current schemas assume the fixture shape).
3. PostgreSQL (or equivalent) instead of single-node SQLite, with migrations.
4. Per-tenant scoping and real identity (OIDC/SSO), because the current operator table is three demo rows.
5. A written data-handling agreement for real OT/IT telemetry, and a decision on whether real containment is ever permitted — today `SEC-OT-01` forbids any real-world effect by construction.

Until those exist, pointing this build at real data would violate `AGENTS.md` §6.

---

## 6. Known Limitations

1. **No AI provider.** PRD §6.7 FR-AI-01…07 are unimplemented. `ai_rationale` is authored fixture prose, labelled as such in the UI ("Authored strategy rationale · synthetic fixture, no model connected").
2. **No live ingestion / connector.** See §5.
3. **No external notarisation.** The HMAC chain proves an entry was not modified or deleted *within this database*, provided the key is uncompromised. It does not prove the whole file was never replaced. The UI and the API `note` field both say this.
4. **SQLite, single node.** No replication, no PostgreSQL adapter, no migrations framework.
5. **Three demo operators.** No user management, no password reset, no MFA. `/signup` explicitly does not create an account.
6. **No pixel-diff verification against Figma.** No screenshot-comparison tooling is configured in this repo, so visual fidelity is asserted only by structural review.
7. **Invariants are inventory-based.** `SEC-OT-01…05` reason over a fixed synthetic asset list. They are a demonstration of a fail-closed policy boundary, not a general-purpose OT policy engine.
8. **`/app/experiments` measures latency, not efficacy.** Containment accuracy and blast-radius accuracy are declared `not_measured` because there is no ground truth.
9. **In-memory rate limiter.** Per-process fixed window; it does not coordinate across workers.
10. **Responsive coverage is measured, not designed against Figma.** Layout at 375/414/768/1024/1440px is verified by an automated sweep for overflow, touch-target size and text legibility, but there is no Figma mobile or tablet frame in this repository to compare against, so the small-screen compositions are conservative extensions of the desktop design (recorded in `DESIGN_HANDOFF.md` §6).

---

## 7. Next Logical Step

The single highest-value next slice is **M5 (AI explanation) behind the existing safety boundary**, because it is the only remaining P0 that has no code at all:

1. Add `apps/api/src/ai/` with a provider adapter interface, a deterministic offline implementation, and schema validation of model output against existing evidence ids.
2. Add timeout, bounded retry, and an explicit "AI unavailable" degraded path — the review workflow must keep working when the provider is down.
3. Keep the rule that AI output is *explanation only*: it may never change a `SEC-OT-*` verdict or an approval decision.
4. Before that, if real data is the actual goal, do the `DataSource` seam (§5 item 1) first — it is a prerequisite for both ingestion and a second AI provider.
