# ROUTE_INVENTORY.md — GARDA-SIM AI
## Master Route Inventory and Figma Visual Asset Mapping

**Status:** Verified Inventory (60 Reference Assets Mapped)  
**Date:** 2026-10-26  
**Governing Documents:** `PRD.md`, `DESIGN.md`, `docs ui/VISUAL HANDOFF · Route and implementation map.png`

---

## 1. Inventory Summary

- **Total Reference Assets in `docs ui`:** 60 files.
- **Reference Viewports:** Desktop (1440px), Tablet (1024px), Mobile (390px).
- **Core Groups:**
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
| **/** (Landing Page) | Public | No | `docs ui/Public ·/· Desktop.png`<br>`docs ui/Public ·/· Tablet.png`<br>`docs ui/Public ·/· Mobile.png` | Desktop (1440x5518)<br>Tablet (1024x6259)<br>Mobile (390x8256) | Not Started | Public Hero, Features preview, Workflow, Safety/Explainability, FAQ, Footer |
| **/features** | Public | No | `docs ui/Public ·/features · Desktop.png` | Desktop (1440x2354) | Not Started | Feature deep dive (Evidence, Simulator, Twin, Safety) |
| **/how-it-works** | Public | No | `docs ui/Public ·/how-it-works · Desktop.png` | Desktop (1440x3309) | Not Started | Step-by-step workflow: Scenario -> Sim -> Safety -> Review |
| **/about** | Public | No | `docs ui/Public ·/about · Desktop.png` | Desktop (1440x2349) | Not Started | Mission, synthetic boundaries, decision-support ethos |
| **/documentation** | Public | No | `docs ui/Public ·/documentation · Desktop.png` | Desktop (1440x3099) | Not Started | Architecture docs, synthetic model limitations, API ref |
| **/faq** | Public | No | `docs ui/Public ·/faq · Desktop.png` | Desktop (1440x2613) | Not Started | Common questions, security boundary clarifications |
| **/contact** | Public | No | `docs ui/Public ·/contact · Desktop.png` | Desktop (1440x1444) | Not Started | Feedback and research inquiry contact form |
| **/privacy** | Public | No | `docs ui/Public ·/privacy · Desktop.png` | Desktop (1440x2196) | Not Started | Privacy policy (synthetic data statement) |
| **/terms** | Public | No | `docs ui/Public ·/terms · Desktop.png` | Desktop (1440x2218) | Not Started | Terms of service and non-liability for simulated data |
| **/security** | Public | No | `docs ui/Public ·/security · Desktop.png` | Desktop (1440x1958) | Not Started | Security posture, deterministic safety assurance |
| **/404** (Not Found) | Public | No | `docs ui/Public · 404 · Desktop.png` | Desktop (1440x1171) | Not Started | Custom 404 page with return action |
| **/login** | Auth | No | `docs ui/Account ·/login · Desktop.png`<br>`docs ui/Account ·/login · Tablet.png`<br>`docs ui/Account ·/login · Mobile.png` | Desktop (1440x1246)<br>Tablet (1024x1323)<br>Mobile (390x2062) | Not Started | Credential sign-in, inline validation, demo presets |
| **/signup** | Auth | No | `docs ui/Account ·/signup · Desktop.png` | Desktop (1440x1521) | Not Started | Account creation form |
| **/forgot-password** | Auth | No | `docs ui/Account ·/forgot-password · Desktop.png` | Desktop (1440x1222) | Not Started | Password recovery email prompt |
| **/reset-password** | Auth | No | `docs ui/Account ·/reset-password · Desktop.png` | Desktop (1440x1343) | Not Started | New password confirmation form |
| **/verify-email** | Auth | No | `docs ui/Account ·/verify-email · Desktop.png` | Desktop (1440x1276) | Not Started | Email verification token entry |
| **/onboarding** | Auth/Setup | Yes | `docs ui/Account ·/onboarding · Step 1 · Desktop.png`<br>`docs ui/Account ·/onboarding · Step 2 · Desktop.png`<br>`docs ui/Account ·/onboarding · Step 3 · Desktop.png`<br>`docs ui/Account ·/onboarding · Step 4 · Desktop.png`<br>`docs ui/Account ·/onboarding · Step 4 · Tablet.png`<br>`docs ui/Account ·/onboarding · Step 4 · Mobile.png`<br>`docs ui/Account ·/onboarding · Step 5 · Desktop.png`<br>`docs ui/Account ·/onboarding · Completion · Desktop.png` | Desktop (1440x1000)<br>Tablet (1024x1004)<br>Mobile (390x1388) | Not Started | 5-step interactive onboarding + completion modal: Role selection, Scenario setup, Safety threshold, Tour |
| **/app** | App (Overview) | Yes | `docs ui/Application ·/app · Desktop.png`<br>`docs ui/Application ·/app · Tablet.png`<br>`docs ui/Application ·/app · Mobile.png` | Desktop (1440x1814)<br>Tablet (1024x1836)<br>Mobile (390x2610) | Not Started | Command Dashboard: Simulation badge, Incident activity, Services at risk, Safety constraints, Recent runs |
| **/app/incidents** | App | Yes | `docs ui/Application ·/app/incidents · Desktop.png`<br>`docs ui/Application ·/app/incidents · Tablet.png`<br>`docs ui/Application ·/app/incidents · Mobile.png` | Desktop (1440x1187)<br>Tablet (1024x1209)<br>Mobile (390x1626) | Not Started | Incident log table, filter/search by severity/status |
| **/app/incidents/:id** | App (Detail) | Yes | `docs ui/Application ·/app/incidents/INC-2026-0042 · Desktop.png`<br>`docs ui/Application ·/app/incidents/INC-2026-0042 · Tablet.png`<br>`docs ui/Application ·/app/incidents/INC-2026-0042 · Mobile.png` | Desktop (1440x1635)<br>Tablet (1024x1697)<br>Mobile (390x3000) | Not Started | Incident `INC-2026-0042` deep dive, affected assets, timeline, candidate response preview |
| **/app/evidence** | App | Yes | `docs ui/Application ·/app/evidence · Desktop.png` | Desktop (1440x1455) | Not Started | Structured log telemetry, synthetic evidence timeline, drawer |
| **/app/simulator** | App | Yes | `docs ui/Application ·/app/simulator · Desktop.png`<br>`docs ui/Application ·/app/simulator · Tablet.png`<br>`docs ui/Application ·/app/simulator · Mobile.png`<br>`docs ui/Application ·/app/simulator · illustrative comparison · Desktop.png` | Desktop (1440x1891)<br>Tablet (1024x1913)<br>Mobile (390x2926)<br>Comparison (1440x1783) | Not Started | Response Strategy Simulator: Multi-candidate comparison, Downtime vs Recovery, Policy checks, Disclaimer |
| **/app/digital-twin** | App | Yes | `docs ui/Application ·/app/digital-twin · Desktop.png`<br>`docs ui/Application ·/app/digital-twin · Tablet.png`<br>`docs ui/Application ·/app/digital-twin · Mobile.png`<br>`docs ui/Application ·/app/digital-twin · illustrative impact · Desktop.png` | Desktop (1440x1696)<br>Tablet (1024x1740)<br>Mobile (390x2562)<br>Impact (1440x1792) | Not Started | Virtual IT/OT Topology: Interactive node graph, directed dependency edges, blast radius highlight |
| **/app/recommendations** | App | Yes | `docs ui/Application ·/app/recommendations · Desktop.png`<br>`docs ui/Application ·/app/recommendations · Tablet.png`<br>`docs ui/Application ·/app/recommendations · Mobile.png` | Desktop (1440x1888)<br>Tablet (1024x2036)<br>Mobile (390x2855) | Not Started | AI Decision Support: Recommendations, Confidence, Evidence citations, Human review approval workflow |
| **/app/experiments** | App | Yes | `docs ui/Application ·/app/experiments · Desktop.png` | Desktop (1440x1800) | Not Started | Evaluation workbench: Baseline vs Strategy runs, Metric tables, Reproducibility seeds |
| **/app/reports** | App | Yes | `docs ui/Application ·/app/reports · Desktop.png` | Desktop (1440x2176) | Not Started | Formatted incident & simulation report preview and export |
| **/app/audit-trail** | App | Yes | `docs ui/Application ·/app/audit-trail · Desktop.png` | Desktop (1440x1248) | Not Started | Chronological immutable simulation audit log |
| **/app/notifications** | App | Yes | `docs ui/Application ·/app/notifications · Desktop.png` | Desktop (1440x1376) | Not Started | System notifications, simulated alerts, approval tasks |
| **/app/settings** | App | Yes | `docs ui/Application ·/app/settings · Desktop.png` | Desktop (1440x1904) | Not Started | Simulator thresholds, AI provider settings (synthetic/live toggle) |
| **/app/profile** | App | Yes | `docs ui/Application ·/app/profile · Desktop.png` | Desktop (1440x1237) | Not Started | Operator profile, role attributes, security clearance |

---

## 3. Coverage Status Summary
- **Total Unique Application Routes:** 23 routes (10 Public, 1 Error, 5 Auth, 1 Onboarding, 13 App).
- **Fully Documented in Figma:** 100% of routes have at least one desktop frame; key operational routes have full Desktop + Tablet + Mobile frames.
- **Current Code Coverage:** 0% (Clean repository start).
