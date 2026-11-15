# ROUTE_INVENTORY.md — GARDA-SIM AI
## Master Route Inventory, Auth Enforcement, and Figma Asset Mapping

**Status:** Verified inventory — 23 unique page routes + 14 API routes, all HTTP-checked
**Last Verified:** 2026-11-14 (production build + live browser pass)
**Governing Documents:** `PRD.md`, `DESIGN.md`, `docs ui/VISUAL HANDOFF · Route and implementation map.png`

> **How to read the Status column.** `Verified` means the route was fetched over HTTP during the last verification pass *and* renders from real data or a real form. `Not implemented` means the route exists and says so on screen — it does not pretend to work. `Redirect layer` means protection is enforced by middleware for navigation only; the real authorization boundary is the API (§3).

---

## 1. Inventory Summary

- **Total reference assets in `docs ui`:** 60 files.
- **Reference viewports:** Desktop (1440px), Tablet (1024px), Mobile (390px).
- **Implemented page routes:** 23 unique (10 public, 1 error, 5 auth, 1 onboarding, 14 app).
- **Implemented API routes:** 14 (see §3).
- **Core groups:**
  1. Design System & Metas (5 assets)
  2. Public Marketing & Documentation (12 assets, 10 routes + 404)
  3. Authentication & Onboarding (15 assets, 6 routes)
  4. Authenticated Application (`/app/...`) (24 assets, 13 routes + 2 detail/illustrative sub-views)
  5. Responsive Drawer (1 asset)

---

## 2. Route & Frame Mapping Table

| Route | Route Type | Auth Required | Reference Frame Filename | Available Viewports | Status | Notes / Layout |
|---|---|---|---|---|---|---|
| **Design System** | Meta | N/A | `docs ui/Design system · Foundations.png` | Desktop (1440x1687) | Verified Reference | Color palette, typography, spacing, elevations |
| **Primitives** | Meta | N/A | `docs ui/Design system · Reusable primitives.png` | Desktop (1440x1702) | Verified Reference | Buttons, inputs, badges, cards, navigation items |
| **States & Overlays** | Meta | N/A | `docs ui/States · Feedback and overlays.png` | Desktop (1440x1453) | Verified Reference | Modals, drawers, alert banners, toast notifications |
| **Visual Map** | Meta | N/A | `docs ui/VISUAL HANDOFF · Route and implementation map.png` | Desktop (1440x3344) | Verified Reference | Route architecture diagram |
| **Mobile Drawer** | Meta | N/A | `docs ui/Responsive · Mobile navigation drawer open.png` | Mobile (390x1275) | Verified Reference | Slide-out mobile navigation drawer |
| **/** (Landing Page) | Public | No | `docs ui/Public ·/· Desktop.png`<br>`docs ui/Public ·/· Tablet.png`<br>`docs ui/Public ·/· Mobile.png` | Desktop (1440x5518)<br>Tablet (1024x6259)<br>Mobile (390x8256) | Verified | Public hero, features preview, workflow, safety/explainability, FAQ, footer. Marketing visuals are labelled as illustrations; no invented benchmark or model name is claimed |
| **/features** | Public | No | `docs ui/Public ·/features · Desktop.png` | Desktop (1440x2354) | Verified | Feature deep dive (evidence, simulator, twin, safety) with an explicit scope statement: the lab is functional against synthetic fixtures, and unimplemented capabilities (live ingestion, AI rationale, containment) are labelled rather than simulated as success |
| **/how-it-works** | Public | No | `docs ui/Public ·/how-it-works · Desktop.png` | Desktop (1440x3309) | Verified | Step-by-step workflow: scenario → simulation → safety → review |
| **/about** | Public | No | `docs ui/Public ·/about · Desktop.png` | Desktop (1440x2349) | Verified | Mission, synthetic boundaries, decision-support ethos |
| **/documentation** | Public | No | `docs ui/Public ·/documentation · Desktop.png` | Desktop (1440x3099) | Verified | Architecture notes, synthetic-model limitations |
| **/faq** | Public | No | `docs ui/Public ·/faq · Desktop.png` | Desktop (1440x2613) | Verified | Questions and security-boundary clarifications; the FAQ search filters the list as you type |
| **/contact** | Public | No | `docs ui/Public ·/contact · Desktop.png` | Desktop (1440x1444) | Verified (form is display-only) | Contact form renders; **no submission endpoint exists**, and the page does not claim a message was sent |
| **/privacy** | Public | No | `docs ui/Public ·/privacy · Desktop.png` | Desktop (1440x2196) | Verified | Privacy statement for synthetic data |
| **/terms** | Public | No | `docs ui/Public ·/terms · Desktop.png` | Desktop (1440x2218) | Verified | Terms, non-liability for simulated output |
| **/security** | Public | No | `docs ui/Public ·/security · Desktop.png` | Desktop (1440x1958) | Verified | Security posture; includes a "what this design does not establish" section (no independent penetration test, no third-party crypto audit) |
| **/404** (Not Found) | Public | No | `docs ui/Public · 404 · Desktop.png` | Desktop (1440x1171) | Verified | Custom 404 with return action; `/does-not-exist` returns HTTP 404 |
| **/login** | Auth | No | `docs ui/Account ·/login · Desktop.png`<br>`docs ui/Account ·/login · Tablet.png`<br>`docs ui/Account ·/login · Mobile.png` | Desktop (1440x1246)<br>Tablet (1024x1323)<br>Mobile (390x2062) | Verified — real authentication | Posts to `POST /api/auth/login`; sets the HttpOnly session cookie; errors render in a `role="alert"` banner; honours a `?next=` destination restricted to `/app…`. No browser storage is written |
| **/signup** | Auth | No | `docs ui/Account ·/signup · Desktop.png` | Desktop (1440x1521) | **Not implemented (by design)** | Account creation does not exist. The submit control is disabled until the terms checkbox is ticked and is labelled "Take the product tour"; the page states "Account creation is not implemented. Use Sign in with a demo operator instead." |
| **/forgot-password** | Auth | No | `docs ui/Account ·/forgot-password · Desktop.png` | Desktop (1440x1222) | **Not implemented (by design)** | No mail transport exists. The page does not claim a reset email was sent |
| **/reset-password** | Auth | No | `docs ui/Account ·/reset-password · Desktop.png` | Desktop (1440x1343) | **Not implemented (by design)** | No reset-token endpoint exists |
| **/verify-email** | Auth | No | `docs ui/Account ·/verify-email · Desktop.png` | Desktop (1440x1276) | **Not implemented (by design)** | No email verification endpoint exists |
| **/onboarding** | Auth/Setup | No (public tour) | `docs ui/Account ·/onboarding · Step 1 · Desktop.png`<br>`docs ui/Account ·/onboarding · Step 2 · Desktop.png`<br>`docs ui/Account ·/onboarding · Step 3 · Desktop.png`<br>`docs ui/Account ·/onboarding · Step 4 · Desktop.png`<br>`docs ui/Account ·/onboarding · Step 4 · Tablet.png`<br>`docs ui/Account ·/onboarding · Step 4 · Mobile.png`<br>`docs ui/Account ·/onboarding · Step 5 · Desktop.png`<br>`docs ui/Account ·/onboarding · Completion · Desktop.png` | Desktop (1440x1000)<br>Tablet (1024x1004)<br>Mobile (390x1388) | Verified (client-side tour) | 5-step tour + completion: role selection, scenario setup, safety threshold, walkthrough. Choices are held in component state only and are **not persisted** — the page is a product tour, not a setup wizard |
| **/app** | App (Overview) | **Yes** — API enforces | `docs ui/Application ·/app · Desktop.png`<br>`docs ui/Application ·/app · Tablet.png`<br>`docs ui/Application ·/app · Mobile.png` | Desktop (1440x1814)<br>Tablet (1024x1836)<br>Mobile (390x2610) | Verified | Command dashboard: live incident counts, high-risk scenarios, virtual services at risk, the five SEC-OT invariants, scenario queue and topology status — all from the API. Shows `—` rather than a placeholder number when a call fails |
| **/app/incidents** | App | **Yes** — API enforces | `docs ui/Application ·/app/incidents · Desktop.png`<br>`docs ui/Application ·/app/incidents · Tablet.png`<br>`docs ui/Application ·/app/incidents · Mobile.png` | Desktop (1440x1187)<br>Tablet (1024x1209)<br>Mobile (390x1626) | Verified | Incident repository table with search and severity/status/confidence filters derived from loaded records |
| **/app/incidents/:id** | App (Detail) | **Yes** — API enforces | `docs ui/Application ·/app/incidents/INC-2026-0042 · Desktop.png`<br>`docs ui/Application ·/app/incidents/INC-2026-0042 · Tablet.png`<br>`docs ui/Application ·/app/incidents/INC-2026-0042 · Mobile.png` | Desktop (1440x1635)<br>Tablet (1024x1697)<br>Mobile (390x3000) | Verified (dynamic route) | Incident deep dive: affected assets, evidence, timeline, candidate response preview, and an analyst note that is appended to the ledger via `POST /api/incidents/{id}/notes`. Evidence and Timeline tabs read the same filtered record set |
| **/app/evidence** | App | **Yes** — API enforces | `docs ui/Application ·/app/evidence · Desktop.png` | Desktop (1440x1455) | Verified | All four synthetic evidence records (EVD-101…104) with timeline, raw-grid and chronological views, category filter and copy-to-clipboard |
| **/app/simulator** | App | **Yes** — API enforces | `docs ui/Application ·/app/simulator · Desktop.png`<br>`docs ui/Application ·/app/simulator · Tablet.png`<br>`docs ui/Application ·/app/simulator · Mobile.png`<br>`docs ui/Application ·/app/simulator · illustrative comparison · Desktop.png` | Desktop (1440x1891)<br>Tablet (1024x1913)<br>Mobile (390x2926)<br>Comparison (1440x1783) | Verified | Response strategy simulator: candidate comparison, modelled downtime vs recovery, and the **server-returned** `evaluated_rules` verdicts for SEC-OT-01…05. Clearance is read from the session and is not selectable. Accepts `?incident=<id>` |
| **/app/digital-twin** | App | **Yes** — API enforces | `docs ui/Application ·/app/digital-twin · Desktop.png`<br>`docs ui/Application ·/app/digital-twin · Tablet.png`<br>`docs ui/Application ·/app/digital-twin · Mobile.png`<br>`docs ui/Application ·/app/digital-twin · illustrative impact · Desktop.png` | Desktop (1440x1696)<br>Tablet (1024x1740)<br>Mobile (390x2562)<br>Impact (1440x1792) | Verified | Virtual IT/OT topology: 6 nodes and their directed dependency edges rendered from `GET /api/topology`; blast radius computed by transitive closure. There is no network probe — the dependency-trace control says so explicitly |
| **/app/recommendations** | App | **Yes** — API enforces | `docs ui/Application ·/app/recommendations · Desktop.png`<br>`docs ui/Application ·/app/recommendations · Tablet.png`<br>`docs ui/Application ·/app/recommendations · Mobile.png` | Desktop (1440x1888)<br>Tablet (1024x2036)<br>Mobile (390x2855) | Verified | Human-in-the-loop review. Candidates come from `GET /api/strategies` × `GET /api/incidents`. A decision posts to `POST /api/recommendations/review`; the API **returns 403** for any attempt to approve a `VIOLATION_BLOCKED` strategy. Rationale text is labelled "Authored strategy rationale · synthetic fixture, no model connected" |
| **/app/experiments** | App | **Yes** — API enforces | `docs ui/Application ·/app/experiments · Desktop.png` | Desktop (1440x1800) | Verified (measured latency only) | Evaluation harness: repeated real `POST /api/simulate` calls with `performance.now()` latency samples. Benefit and downtime are **modelled profile values**; containment accuracy and blast-radius accuracy are declared `not_measured` |
| **/app/reports** | App | **Yes** — API enforces | `docs ui/Application ·/app/reports · Desktop.png` | Desktop (1440x2176) | Verified | Exports built from live API data: ledger JSON (with chain-verification result), strategy brief Markdown, evidence CSV. A failed export reports the failure and never renders as a success |
| **/app/audit-trail** | App | **Yes** — API enforces | `docs ui/Application ·/app/audit-trail · Desktop.png` | Desktop (1440x1248) | Verified | Append-only, HMAC-SHA256-chained simulation audit ledger, paginated, with actor/event filters and a chain-verification banner. Entries carry a `SYNTHETIC` marker where applicable. The page states that a chained hash is not external notarisation |
| **/app/notifications** | App | **Yes** — API enforces | `docs ui/Application ·/app/notifications · Desktop.png` | Desktop (1440x1376) | Verified | Activity feed derived from the audit ledger (newest 50). There is no separate notification store, and the page says so |
| **/app/settings** | App | **Yes** — API enforces | `docs ui/Application ·/app/settings · Desktop.png` | Desktop (1440x1904) | Verified (read-only by design) | Session/operator, safety policy and storage facts resolved from `GET /api/auth/me` and `GET /health`. Nothing is editable from the browser; sign-out calls `POST /api/auth/logout`. The Figma "AI provider (synthetic/live toggle)" is **not implemented** and has no control |
| **/app/profile** | App | **Yes** — API enforces | `docs ui/Application ·/app/profile · Desktop.png` | Desktop (1440x1237) | Verified (read-only by design) | Operator identity, clearance and session facts from the API. Credential editing is rendered as an explicitly disabled "not implemented" control |

---

## 3. API Route Inventory

All routes are served by `apps/api/src/main.py`. **Every `/api/*` route requires a session cookie**; `Auth` lists the additional dependencies.

| Method | Path | Auth | Behaviour |
|---|---|---|---|
| GET | `/health` | None | Liveness + `environment`, `data_backend`, `strict_ot_mode`, `min_operator_clearance`, `session_ttl_minutes`, `simulation_only` |
| POST | `/api/auth/login` | None | Sets an HttpOnly `garda_session` cookie; 401 on bad credentials; constant-work path for unknown operators |
| POST | `/api/auth/logout` | Session | 204; revokes the session server-side |
| GET | `/api/auth/me` | Session | Operator id, display name, clearance, expiry |
| GET | `/api/auth/demo-hint` | None | 404 unless a generated demo credential exists; never available in production |
| GET | `/api/incidents` | Session | Synthetic incident list |
| GET | `/api/incidents/{id}` | Session | Single incident; 404 does not echo the input |
| GET | `/api/evidence` | Session | Four synthetic evidence records |
| GET | `/api/topology` | Session | Six virtual assets with `depends_on` |
| GET | `/api/strategies` | Session | Three candidate strategies |
| POST | `/api/simulate` | Session + clearance + origin + rate limit | Deterministic simulation; appends a `SIMULATION_RUN` ledger entry; 400 on unknown scenario/out-of-scope asset, 422 on unknown strategy |
| POST | `/api/recommendations/review` | Session + clearance + origin + rate limit | Records a human decision; **403 when approving a `VIOLATION_BLOCKED` strategy**; appends `STRATEGY_REVIEW` or `STRATEGY_REVIEW_REFUSED` |
| POST | `/api/incidents/{id}/notes` | Session + origin + rate limit | Appends an `INCIDENT_NOTE` ledger entry |
| GET | `/api/audit-trail` | Session | Paginated ledger (`limit` 1…200, `offset`), returns `entries`/`total`/`limit`/`offset` |
| GET | `/api/audit-trail/verify` | Session + clearance | Verifies the HMAC chain → `{verified, checked_entries, broken_seq, algorithm, note}` |

---

## 4. Auth Enforcement Model

Three layers, and only one of them is an authorization boundary:

1. **Navigation guard** — `apps/web/src/middleware.ts` redirects a request for `/app…` to `/login?next=…` when no `garda_session` cookie is present, and redirects an authenticated request for `/login` or `/signup` to `/app`. Verified over HTTP: `GET /app/audit-trail` → `307 → /login?next=%2Fapp%2Faudit-trail`. This is a **redirect layer only** — the Edge runtime cannot reach SQLite, and a forged cookie would pass it.
2. **Session resolution** — `security.require_session` resolves the cookie against the `sessions` table (only a SHA-256 of the token is stored), rejects expired and revoked tokens, and returns **401**. This is the boundary for reads.
3. **Policy dependencies** — state-changing routes add `security.require_clearance` (403 below `MIN_OPERATOR_CLEARANCE`) and `security.require_trusted_origin` (403 on a disallowed `Origin`), plus per-scope rate limiting (429 + `Retry-After`).

Verified unauthenticated behaviour: `GET /api/incidents` → 401; a forged `Authorization: Bearer …` header is ignored (the cookie is the only credential); `POST /api/recommendations/review` for `STRAT-A` with `"Approved for Demonstration"` → 403.

---

## 5. Coverage Status Summary

- **Unique page routes:** 23 (10 public, 1 error, 5 auth, 1 onboarding, 14 app — `/app/incidents/[id]` is the only dynamic route).
- **Unique API routes:** 14.
- **Implemented and HTTP-verified:** 23/23 page routes return the expected status; 18/23 render functional data or a real form; 5 auth routes are deliberately non-functional and say so on screen (`/signup`, `/forgot-password`, `/reset-password`, `/verify-email`, and the display-only `/contact` form).
- **Figma coverage:** every route has at least one desktop frame; key operational routes have full Desktop + Tablet + Mobile frames.
- **Build coverage:** `next build` prerenders 31 route entries (23 pages + route handlers/layouts); `/app/incidents/[id]` is a dynamic (ƒ) route.
- **Not covered:** there is no automated screenshot comparison against the Figma frames, so visual fidelity is asserted by structural review only.
