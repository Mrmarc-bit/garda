# DESIGN_HANDOFF.md — GARDA-SIM AI
## Design Tokens, Responsive Rules, Shared Components, and Visual Fidelity Handoff

**Status:** Verified design specification — deviations recorded 2026-11-14 (see §6)
**Date:** 2026-10-26 (reconciled 2026-11-14)
**Governing Documents:** `DESIGN.md`, `docs ui/Design system · Foundations.png`, `docs ui/Design system · Reusable primitives.png`, `docs ui/States · Feedback and overlays.png`

---

## 1. Visual Identity & Design Foundations

The visual identity is a high-density, high-trust, dark cybersecurity operational console with restrained safety-orange accents and disciplined typography.

### 1.1 Verified Color Tokens

```css
:root {
  /* Surface & Backgrounds */
  --color-bg-primary: #171717;       /* Main canvas background */
  --color-bg-secondary: #202020;     /* Navigation sidebar & headers */
  --color-surface-card: #252525;     /* Standard card / container surface */
  --color-surface-elevated: #2C2C2C; /* Dropdown, modal, popover surface */
  --color-surface-input: #1D1D1D;    /* Input fields and search boxes */

  /* Borders & Dividers */
  --color-border-default: #383838;   /* Component and card borders (1px) */
  --color-border-subtle: #303030;    /* Internal dividers and table row borders */

  /* Text & Content */
  --color-text-primary: #F5F5F5;     /* Headings, primary labels, values */
  --color-text-secondary: #A3A3A3;   /* Secondary descriptions, subtitles */
  --color-text-muted: #737373;       /* De-emphasized timestamps, helper text */

  /* Brand & Accent */
  --color-accent-primary: #FF6B35;   /* Primary action, active tab indicator, key badges */
  --color-accent-hover: #FF8255;     /* Interactive hover state */
  --color-accent-soft: #42271F;      /* Soft orange tint for badge backgrounds */

  /* Status Colors */
  --color-status-success: #4ADE80;   /* Passed safety rules, healthy assets */
  --color-status-warning: #FBBF24;   /* Degraded performance, caution warnings */
  --color-status-critical: #F87171;  /* Incident active, policy violation */
  --color-status-info: #60A5FA;      /* Informational notices, evidence indicators */
  --color-status-neutral: #A3A3A3;   /* Idle, pending, or unassessed states */
}
```

### 1.2 Typography Hierarchy

Typeface: **Inter** (Fallback: system-ui, -apple-system, sans-serif).  
Monospace: **JetBrains Mono** or standard system monospace for log lines, IP addresses, asset IDs.

| Role | Size | Weight | Line Height | Tracking | Usage |
|---|---|---|---|---|---|
| **Display / Hero** | 48px (3rem) | 700 (Bold) | 1.15 | -0.02em | Public landing hero headline |
| **Heading 1 / Page** | 30px (1.875rem) | 600 (Semibold) | 1.25 | -0.015em | Top-level view header |
| **Heading 2 / Section** | 22px (1.375rem) | 600 (Semibold) | 1.3 | -0.01em | Major dashboard card/section titles |
| **Heading 3 / Card** | 16px (1rem) | 600 (Semibold) | 1.4 | -0.005em | Subsections, modal titles |
| **Body / Default** | 14px (0.875rem) | 400 (Regular) | 1.5 | 0 | Default content, table body |
| **Body / Small** | 12px (0.75rem) | 400 (Regular) | 1.4 | 0 | Supporting details, metadata |
| **Label / Badge** | 12px (0.75rem) | 500 (Medium) | 1.3 | 0.01em | Form labels, status pill badges |
| **Metric / KPI** | 32px (2rem) | 600 (Semibold) | 1.2 | Tabular nums | Dashboard statistics, numeric totals |
| **Code / Telemetry** | 12px (0.75rem) | 400 (Regular) | 1.45 | Monospace | Evidence logs, JSON payloads, IDs |

---

## 2. Spacing, Borders, and Radii

- **Base Grid:** 8px system with 4px micro-increment.
  - `4px`: Icon/text gap, micro padding inside badges.
  - `8px`: Compact controls, button internal vertical padding.
  - `12px`: Card inner spacing for small widgets, input internal padding.
  - `16px`: Standard card padding, standard gap between form controls.
  - `24px`: Section gaps, grid gutters.
  - `32px`: Page-level container padding on Desktop.
  - `48px - 64px`: Public marketing landing page section gutters.
- **Corner Radii:**
  - `8px` (`rounded-lg`): Buttons, badge pills, small dropdowns, input elements.
  - `12px` (`rounded-xl`): Standard dashboard cards, content containers.
  - `16px` (`rounded-2xl`): Modals, floating drawers, hero highlight cards.
- **Border Treatment:**
  - Strict `1px solid var(--color-border-default)` (`#383838`).
  - No thick neon borders or heavy glow effects.
  - No harsh box shadows. Soft ambient drop shadow only for modals and elevated popovers: `0 8px 32px rgba(0, 0, 0, 0.45)`.

---

## 3. Responsive Shell Architecture

### 3.1 Desktop (1440px viewport)
- Left persistent sidebar: `248px` fixed width.
  - GARDA-SIM AI logo + version tag.
  - Primary navigation links (Overview, Incidents, Simulator, Digital Twin, Evidence, Recommendations, Experiments, Reports, Audit Trail).
  - Bottom section: Settings, Profile, Logout.
- Top bar: `64px` fixed height.
  - Breadcrumbs.
  - `SIMULATION ONLY` persistent amber/orange defense badge.
  - Quick scenario switcher dropdown.
  - Search trigger, notifications bell, user avatar.
- Main content container: `padding: 32px`, `max-width: 1440px`, centered.

### 3.2 Tablet (1024px viewport)
- Collapsible or condensed sidebar (`72px` icons only, or drawer).
- Top bar with hamburger toggle.
- Main content container: `padding: 24px`.
- 3-column layouts wrap gracefully into 2-column or stacked layouts.

### 3.3 Mobile (390px viewport)
- Compact header: `56px` height.
- Hamburger button opening slide-out drawer (`docs ui/Responsive · Mobile navigation drawer open.png`).
- Main content container: `padding: 16px`.
- 1-column layout for cards and metrics.
- Tables support card-view transform or explicit horizontal scroll container with scroll hints.

---

## 4. Reusable Component Inventory

Extracted from `docs ui/Design system · Reusable primitives.png`:
1. **Buttons (`Button`)**:
   - `primary`: Background `#FF6B35`, text `#FFFFFF`, hover `#FF8255`.
   - `secondary`: Background `#2C2C2C`, border `#383838`, text `#F5F5F5`.
   - `outline`: Transparent, border `#383838`, text `#F5F5F5`.
   - `ghost`: Transparent, text `#A3A3A3`, hover text `#F5F5F5`.
   - `destructive`: Background `#F87171` (or outline with critical accent).
2. **Badges (`Badge`)**:
   - Status indicators (`Success`, `Warning`, `Critical`, `Info`, `Neutral`).
   - Safety indicator (`SIMULATION ONLY`).
   - Scenario confidence pill (`82% Confidence`, `Synthetic Evidence`).
3. **Cards (`Card`)**:
   - Background `#252525`, border `1px solid #383838`, radius `12px`.
   - Header with title, action slot, subtitle.
4. **Input Controls**:
   - Text inputs, search bar, dropdown selects, toggle switches, tab bars.
5. **Feedback Overlays (`States · Feedback and overlays.png`)**:
   - Slide-out details drawer (Evidence detail, Node detail).
   - Confirmation dialogs (Approve recommendation, Reset simulation).
   - Toast notification stack (Bottom-right, dark surface with status icon).

---

## 5. Visual Quality Acceptance Gates

Before declaring any screen complete:
1. Capture screenshot at 1440px, 1024px, and 390px.
2. Direct comparison against corresponding PNG in `docs ui`.
3. Check alignment, font sizes, color contrast, and padding.
4. Verify `SIMULATION ONLY` badge presence in all authenticated views.
5. Record any minor discrepancies in this handoff log.

---

## 6. Deviations and Inferences Recorded (2026-11-14)

`AGENTS.md` §4 requires that any UI state not shown in Figma be extended conservatively **and recorded here**. It also requires that every visible control work, be clearly disabled, or be marked prototype-only. This section records both kinds of decision from the remediation pass.

### 6.1 Figma affordances deliberately rendered as read-only or disabled

| Screen | Figma affordance | What was built instead | Why |
|---|---|---|---|
| `/app/settings` | "AI provider (synthetic/live toggle)", editable thresholds | Read-only facts from `GET /health` and `GET /api/auth/me`; no toggle exists | No AI provider and no policy-editing endpoint exist. A working-looking toggle that changed nothing would be a fake control |
| `/app/settings` | "Reset simulation" / destructive action (States frame) | An explanatory card stating there is deliberately no destructive reset endpoint | An append-only ledger that a browser could truncate would not be append-only |
| `/app/profile` | Editable profile and credential forms | Read-only `<dl>` plus a **disabled** "Update credentials — not implemented" control | No profile or credential endpoint exists |
| `/app/signup` | Account creation form | Submit disabled until the terms checkbox is ticked, labelled "Take the product tour" | Account creation is not implemented; the page says so |
| `/app/forgot-password`, `/reset-password`, `/verify-email` | Submission flows | Rendered, non-functional, and explicit about it | No mail transport or token endpoint exists |
| `/contact` | Contact form | Display-only; never claims a message was sent | No submission endpoint exists |
| `/app/simulator` | Operator clearance selector (Level 2 / Level 3) | Read-only text resolved from the session | Clearance is an authorization fact; a client-side selector would imply the browser can raise it |
| `/app/onboarding` | Setup wizard that configures the workspace | 5-step product tour; choices live in component state only | No persistence endpoint exists for onboarding choices |

### 6.2 States added beyond Figma (conservative extensions)

- **Degraded/error states.** Every data-driven screen renders an explicit `role="alert"` panel when a call fails, and states that no placeholder numbers are substituted. Figma has no error frame, so the nearest approved pattern (the alert banner in `States · Feedback and overlays.png`) was reused.
- **Loading states.** `apps/web/src/app/app/loading.tsx` plus per-page skeletons for the simulator. Metric values render a spinner while loading and `—` on failure.
- **Empty states.** `/app/experiments` before any run ("No evaluation has been run … nothing is pre-filled"); `/app/notifications` distinguishes an empty ledger from a filtered-out list; `/app/incidents` and `/app/evidence` state the source is the REST API.
- **Integrity caveat copy.** The audit-trail page carries a paragraph stating that a chained hash detects modification or deletion of an earlier entry but is not external notarisation or a certification. This is new copy, not in Figma, and exists to keep the visual language from overclaiming.
- **`SYNTHETIC` marker** on seeded ledger rows, so a seeded record cannot be mistaken for a runtime action.

### 6.3 Visual elements removed because they represented fabricated behaviour

- `/app/experiments`: the pre-filled results table, the containment/blast-accuracy figures and the "run" animation that returned constants.
- `/app/digital-twin`: the "Ping Virtual Node" control and its hardcoded `1.4 ms` / `0.0 %` readout.
- `/app`: the 4-bar activity chart with fixed 09:13–09:16 bars, the hardcoded topology list, and the `|| 1` / `|| 2` metric floors.
- `/app/audit-trail`: the "TAMPER VERIFIED" badge and the "SHA-256 Verified" chip, both of which asserted a verification that did not run.
- `/app/reports`: "Integrity: Tamper-Verified" and "Exportable with SHA-256 signatures".
- Landing visuals: the `Claude-3.5-Sonnet-Specimen` model label and the invented evidence ids `EV-0042-01…03`. Real fixture ids (`EVD-101/102/103`, 14:10:12 / 14:11:05 / 14:11:42) are used instead.

### 6.4 Accessibility deviations from Figma

- Interactive rows and nodes that Figma draws as plain containers are now real `<button aria-pressed>` elements with a visible `focus-visible` outline (digital twin, evidence timeline and grid, incidents, recommendations, audit trail).
- Tabs carry `role="tablist"` / `role="tab"` / `aria-selected` on recommendations, reports, settings, profile, evidence and incident detail.
- A `@media (prefers-reduced-motion: reduce)` block in `globals.css` neutralises animation and transition durations, because 20 `animate-pulse`/`ping`/`spin` usages otherwise ignored the preference.
- Inputs previously identified only by placeholder text now have `id` + associated label (search fields, note textarea, filters).
- **No mobile or tablet frame exists in the Figma source.** Small-screen composition is a conservative extension of the approved desktop pattern, recorded here rather than invented: the sidebar becomes an off-canvas drawer below 1024px (Escape closes it, it is `inert` while closed), the header collapses to icon-only controls below 1280px, the digital-twin graph scrolls horizontally instead of reflowing its percentage-positioned nodes, and the simulator strategy cards became `<label>`-wrapped so the whole card is the tap target. Measured at 375/414/768/1024/1440px: no horizontal overflow, no control below 24x24 (36px on touch), no text below 10px.
- **Dense tables become stacked cards below `md`.** The Figma desktop frames draw the audit ledger, incident repository and experiment matrix as multi-column tables. Those layouts are unreadable at 390px without horizontal scrolling, so below `md` each row becomes a card that keeps every field visible (audit: timestamp, result badge, actor, event, resource, hash prefix, SYNTHETIC marker; incidents: id, status badge, title, summary, asset, severity, Simulate action; experiments: strategy, verdict badge, failed rules, median latency, modelled benefit and downtime). The table is restored from `md` up. This is a deliberate responsive deviation from the desktop frame, not a redesign.
- Touch ergonomics are enforced in `globals.css` rather than per component: a 24px floor for every control at every viewport (WCAG 2.5.8 AA), raised to 40px for form controls and 32–44px for text buttons and tabs on coarse pointers.


### 6.5 Navigation transitions and loading states (2026-11-15)

Not present in any Figma frame; implemented as a conservative extension of the
approved visual language and recorded here per `AGENTS.md` §4.

| Element | Decision | Rationale |
|---|---|---|
| Route transition | 220ms opacity + 6px rise, CSS-only (`template.tsx`) | A JS-driven `initial={{opacity:0}}` leaves the page invisible until hydration, which reads as a broken app on a slow connection |
| Navigation progress bar | 2px `#FF6B35` bar at the top edge | The only brand-accent colour already used for primary actions; no new colour introduced |
| Loading placeholders | Shaped skeletons in `#343434` (lighter than the `#252525` card) with a white 18% sweep | A placeholder darker than its surface reads as a hole; the convention is lighter-than-surface |
| Skeleton shapes | Mirror the real layout: 4 KPI cards, 3 cards, 5 table rows, 2-col settings/profile cards | Keeps layout shift near zero when real content arrives |
| Reduced motion | The existing `prefers-reduced-motion` block zeroes the transition and the shimmer | Required by `AGENTS.md` §4 |

Still open: no automated screenshot comparison against Figma (§6.6).

### 6.6 Still open

- No automated screenshot comparison exists, so gates 1–3 of §5 are performed by hand and are not regression-proof.
- Tablet and mobile frames were checked structurally through the shared shell and drawer, not pixel-compared.
