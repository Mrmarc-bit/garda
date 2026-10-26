# DESIGN.md — GARDA-SIM AI
## UI/UX Design System, Screen Contract, and Visual Consistency Rules

**Status:** Design implementation baseline  
**Product:** GARDA-SIM AI — AI-Assisted Cyber Defense Response Simulator  
**Source of truth:** Approved Figma Design exports and existing UI design brief. This document operationalizes the approved design; it does not authorize redesigning it.

> **Critical rule:** Figma is the visual source of truth. This document is the interpretation and implementation contract. If a value or layout in an actual Figma frame conflicts with a generic guideline below, follow the specific Figma frame and record the discrepancy. Never silently invent a replacement UI.

---

## 1. Purpose and non-negotiable rules

This document prevents visual drift, inconsistent screens, and generic AI-generated UI.

1. Do not redesign approved screens from scratch.
2. Do not replace the Figma visual language with a starter template.
3. Do not invent new sections, metrics, navigation groups, cards, gradients, or animations unless required by the product and not already specified.
4. Use exported frames, components, assets, and existing design documentation before making visual decisions.
5. Reuse shared components and tokens. Do not create page-specific copies of existing components without a documented reason.
6. Match layout, typography, spacing, alignment, borders, radius, iconography, and hierarchy against the relevant frame.
7. If a required state is not designed, extend the nearest existing pattern conservatively and document the inference.
8. Treat functionality and visual fidelity as separate acceptance dimensions. A visually accurate screen may still have broken behavior.
9. Do not fabricate data, live telemetry, AI outputs, benchmark numbers, customer logos, testimonials, or operational integrations.
10. Do not claim pixel-perfect fidelity without a screenshot comparison against the actual design.

## 2. Product visual character

GARDA-SIM AI should feel like a calm, precise, high-trust defensive cybersecurity application.

**Visual characteristics**
- Dark charcoal and near-black surfaces.
- Restrained orange accent.
- Strong typographic hierarchy.
- Dense but readable operational information.
- Subtle borders and surface contrast.
- Consistent alignment and spacing.
- Minimal decorative effects.
- Clear distinctions between evidence, derived assessment, AI explanation, and policy validation.
- Human review remains visible in the interface.

**Avoid**
- Generic AI SaaS dashboards.
- Purple/blue gradients as the dominant brand language.
- Neon borders around every card.
- Excessive glassmorphism.
- Random circuit-board backgrounds.
- Matrix rain, hooded-hacker photos, or sci-fi HUD decoration.
- Unnecessary 3D.
- Random card grids that do not reflect the product workflow.
- Fake real-time indicators.
- Repeated cards used to fill space.
- Decorative animation that slows down operational tasks.
- Overly rounded, over-shadowed components inconsistent with Figma.

## 3. Design tokens

The values below are the shared baseline from the supplied UI brief. Actual exported Figma variables and frame-specific values take precedence if they differ.

### 3.1 Colors

| Token | Value | Intended use |
|---|---|---|
| `color.bg.primary` | `#171717` | Main app background |
| `color.bg.secondary` | `#202020` | Secondary surface |
| `color.surface.card` | `#252525` | Standard card |
| `color.surface.elevated` | `#2C2C2C` | Elevated popover/modal surface |
| `color.surface.input` | `#1D1D1D` | Input background |
| `color.border.default` | `#383838` | Standard borders |
| `color.border.subtle` | `#303030` | Low-emphasis dividers |
| `color.text.primary` | `#F5F5F5` | Main text |
| `color.text.secondary` | `#A3A3A3` | Supporting text |
| `color.text.muted` | `#737373` | Muted labels, only when contrast remains adequate |
| `color.accent.primary` | `#FF6B35` | Primary action and selected emphasis |
| `color.accent.hover` | `#FF8255` | Hover state |
| `color.accent.soft` | `#42271F` | Subtle orange surface |
| `color.status.success` | `#4ADE80` | Success |
| `color.status.warning` | `#FBBF24` | Warning |
| `color.status.critical` | `#F87171` | Critical |
| `color.status.info` | `#60A5FA` | Information |
| `color.status.neutral` | `#A3A3A3` | Neutral status |

Status must never be communicated by color alone. Pair color with text, icon, shape, or an accessible label.

Orange is an accent, not a surface color for every card. Keep primary actions visually distinct.

### 3.2 Typography

Baseline typeface: **Inter**. Use the exact Figma font/style where exported metadata is available.

| Style | Baseline | Usage |
|---|---:|---|
| Display / Large | 48 px, bold | Public hero only when shown in Figma |
| Heading / Page | 30 px, semibold | Main page title |
| Heading / Section | 22 px, semibold | Major sections |
| Heading / Card | 16 px, semibold | Card title |
| Body / Default | 14 px, regular | Main body and data UI |
| Body / Small | 12 px, regular | Secondary detail |
| Label / Default | 12 px, medium | Form labels and metadata |
| Metric / Large | 32 px, semibold, tabular numerals | Overview metrics |
| Code / Log | 12 px, monospace | Synthetic logs and technical identifiers |

Do not apply large marketing typography to dense operational tables. Use tabular numerals for metrics when supported.

### 3.3 Spacing and layout

Use an 8 px spacing scale with 4 px micro-spacing:
- 4 px: icon/label micro-gap.
- 8 px: compact controls.
- 12 px: related elements.
- 16 px: card internals.
- 24 px: component gaps.
- 32 px: section spacing.
- 48 px: major sections.
- 64 px: large marketing sections.

Baseline radii:
- 8 px: compact controls/badges.
- 12 px: standard cards/inputs.
- 16 px: larger panels/dialogs.
- 20 px: selected feature panels only when supported by the frame.

Borders are generally 1 px. Prefer surface contrast over large shadows.

### 3.4 Breakpoints and target frames

- Desktop reference: 1440 px.
- Tablet reference: 1024 px.
- Mobile reference: 390 px.

Do not invent a breakpoint solely to make one component easier. Use the project's chosen responsive system, then verify at these reference widths.

## 4. Source-of-truth priority

When instructions conflict, resolve them in this order:

1. Actual approved Figma frame/component for that screen.
2. User-provided exported design assets and measurements.
3. Existing `DESIGN.md` and UI brief.
4. This design implementation contract.
5. Established patterns from adjacent screens.
6. Conservative inference, explicitly recorded in `DESIGN_HANDOFF.md`.

Never use generic AI taste as the deciding authority.

## 5. Required screen inventory

The exact design exports determine which frames exist. The intended product route inventory is:

### Public website
- `/`: landing page.
- `/features`: feature detail.
- `/how-it-works`: product workflow.
- `/about`: product scope and mission.
- `/documentation`: product usage and limitations.
- `/faq`: frequently asked questions.
- `/contact`: contact form, if supported.
- `/privacy`: privacy policy.
- `/terms`: terms of service.
- `/security`: security and safety model.

### Authentication and onboarding
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/verify-email`
- `/onboarding`

Only implement flows compatible with the chosen authentication provider. If a frame does not exist for an error state, extend the closest approved form pattern rather than inventing a new visual system.

### Authenticated application
- `/app`: Overview Dashboard.
- `/app/incidents`: incident list.
- `/app/incidents/:id`: incident detail.
- `/app/evidence`: Evidence & Timeline.
- `/app/simulator`: Response Simulator.
- `/app/digital-twin`: IT/OT Digital Twin.
- `/app/recommendations`: AI Recommendations.
- `/app/experiments`: Experiments & Evaluation.
- `/app/reports`: Reports.
- `/app/audit-trail`: Audit Trail.
- `/app/settings`: Settings.
- `/app/profile`: Profile.
- `/app/notifications`: Notifications.

If the actual Figma export contains different route labels, preserve the visual naming and map routes in `ROUTE_INVENTORY.md`.

## 6. Shared application shell

### Desktop
- Sidebar baseline approximately 248 px.
- Top bar baseline approximately 64 px.
- Main content padding baseline 32 px.
- Standard content gap baseline 24 px.
- Persistent navigation and visible active route.
- Breadcrumbs, global search, notifications, user menu, environment indicator.

### Tablet
- Collapsible sidebar.
- Main content padding baseline 24 px.
- Reduce columns when needed; preserve reading order.

### Mobile
- Compact header.
- Drawer or approved mobile navigation pattern.
- Main content padding baseline 16 px.
- Single-column metric cards.
- Tables use a designed mobile pattern or controlled horizontal scrolling.
- Drawers may become full-screen views/bottom sheets if consistent with the design.
- No unintended page-level horizontal overflow.

### Persistent safety label
The application shell must clearly display `SIMULATION ONLY` or the exact approved equivalent. The environment is synthetic; never imply connection to a real military or production network.

## 7. Page-level UI contracts

The exported Figma frames take precedence. The following describes content that must be represented, not permission to rearrange an approved frame arbitrarily.

### 7.1 Landing page
Expected content:
- Header with brand, public navigation, sign-in, and primary CTA.
- Hero with clear value proposition and product preview.
- Product capability sections.
- How-it-works workflow.
- Safety/explainability section.
- Evaluation/research explanation.
- FAQ preview.
- Final CTA.
- Footer with product, docs, and legal links.

Use a product-specific simulator preview, not generic hacker stock photography. Do not invent testimonials, customers, certifications, or performance numbers.

### 7.2 Login and signup
- Match the approved auth composition.
- Use labeled inputs and clear inline validation.
- Provide show/hide password where appropriate.
- Loading, success, and error states must follow the same visual system.
- Do not show OAuth buttons unless provider integration is configured.
- Avoid adding fields that are not required.

### 7.3 Overview Dashboard
Expected content:
- Page title and subtitle.
- `SIMULATION ONLY` badge.
- Time range where supported.
- Active simulated incidents.
- High-risk scenarios.
- Services at risk.
- Safety constraints enforced.
- Synthetic incident activity chart.
- Recent incidents.
- Virtual service health.
- Latest recommendations.
- Recent simulation runs.
- Activity timeline.

All sample values must be labeled as synthetic/demo. Do not present placeholders as real-time telemetry.

### 7.4 Incident list and detail
List supports search, filtering, sorting, pagination, empty/loading/error states.
Detail shows incident summary, severity, confidence semantics, affected assets, evidence references, timeline, possible operational impact, candidate strategies, notes, and audit history.

### 7.5 Evidence & Timeline
- Chronological timeline.
- Searchable/filterable synthetic log table.
- Evidence detail drawer.
- Correlation view where supported.
- Distinguish observed fact, derived assessment, and AI explanation.
- Evidence references must resolve to real records in the demo dataset.

### 7.6 Response Simulator
- Scenario and incident context.
- Candidate strategy comparison.
- Run and reset controls.
- Security benefit, operational impact, affected services, simulated downtime, recovery effort, and policy validation.
- Explanation with supporting evidence, assumptions, uncertainty, trade-offs, and alternatives.
- Visible disclaimer: `Results are simulated estimates, not guarantees of real-world outcomes.`
- Running, completed, failed, and cancelled states must be visually distinct.
- No real-world action button or language implying actual containment.

### 7.7 IT/OT Digital Twin
- Virtual nodes and directed dependency edges.
- Node types and edge meanings have a legend.
- Selectable node and details panel.
- Zoom/pan/search/fit-to-screen if supported.
- Impact overlay and baseline reset.
- Provide textual alternative/list of assets and dependencies for accessibility.
- Prefer readable 2D graph over gratuitous 3D.

### 7.8 AI Recommendations
Every recommendation should show:
- Related incident.
- Supporting evidence.
- Confidence and uncertainty.
- Security and operational impact.
- Policy validation.
- Alternatives.
- Human-review state.

Review statuses: `Pending Review`, `Approved for Demonstration`, `Rejected`, `Requires More Evidence`. These are workflow states, not real security execution.

### 7.9 Experiments & Evaluation
- Experiment configuration.
- Scenario/dataset selector.
- Run ID and timestamps.
- Metric definitions.
- Baseline comparison.
- Results table and charts.
- Notes and export where implemented.

Before actual evaluation, show an honest empty state such as `No experiment run yet`. Never fabricate improved percentages.

### 7.10 Reports
- Incident, simulation comparison, experiment, and audit reports.
- Preview before export.
- Include run ID, timestamp, configuration, evidence, strategies, safety evaluation, results, and limitations.
- Export controls must reflect actual functionality.

### 7.11 Audit Trail
- Timestamp, actor, event type, related resource, summary, result, and evidence/run reference.
- Search/filter and detail view.
- Do not label logs immutable unless the implementation proves it.

### 7.12 Settings, profile, notifications
- Settings should only appear active if they persist and have a real effect.
- Mark unsupported provider controls as unavailable/prototype.
- Profile fields must match backend capability.
- Notification read/unread status should persist if presented as persistent.

## 8. Component reuse policy

Before creating a component:
1. Search existing components.
2. Search exported Figma component names.
3. Check whether a variant or composition of an existing component is sufficient.
4. Add a new component only when its behavior or structure is genuinely distinct.
5. Document its variants and intended usage.

Required reusable patterns include:
- Public navigation/footer.
- App sidebar/top bar/breadcrumb.
- Buttons, inputs, selects, tabs, dropdowns.
- Metric cards, data tables, pagination.
- Severity/status badges.
- Alerts, toasts, tooltips.
- Modals and drawers.
- Loading skeletons, empty states, errors.
- Evidence and recommendation cards.
- Strategy comparison rows/cards.
- Timeline events.
- Graph nodes/legend/controls.
- Audit rows.

Do not detach or duplicate a shared component merely to fix one screen. Add a variant or compositional API when justified.

## 9. Interaction and animation rules

### Motion
- Motion for React/Framer Motion: component state transitions, small entrances, menus, drawers, and shared-layout transitions when useful.
- GSAP: limited complex sequences or selected landing-page scroll storytelling.
- Three.js: only for a demonstrated 3D use case that improves comprehension.

Do not animate every card. Do not use GSAP and Motion to control the same element. Avoid scroll-jacking. Respect `prefers-reduced-motion`. Motion must not delay primary actions or make dense data harder to read.

### Interaction contract
Every visible interactive element must have:
- A real action and destination, or
- A clearly disabled state with explanation, or
- A documented prototype-only behavior.

No decorative buttons. No fake loading that never resolves. No success toast before the server confirms success.

## 10. Data presentation rules

Use one consistent synthetic dataset across all pages. Example:
- Incident: `INC-2026-0042`
- Title: `Suspicious Privilege Escalation`
- Asset: `APP-GW-02`
- Synthetic identity: `analyst-demo-03`
- Status: `Awaiting Review`
- Illustrative confidence: `0.82`

Example virtual assets:
- `IDENTITY-SVC-01`
- `APP-GW-02`
- `MONITOR-01`
- `OPS-DASH-01`
- `OT-CONTROLLER-SIM-01`
- `TELEMETRY-SIM-01`

Use `0.82` only as an illustrative score unless the score's semantics are defined and tested. Keep IDs, names, timestamps, status, and relationships consistent.

### Semantic labels
Use labels to distinguish:
- `Synthetic Evidence`
- `Derived Assessment`
- `AI-Generated Explanation`
- `Policy Validation`
- `Simulation Only`

Do not communicate confidence or risk using color alone.

## 11. Accessibility requirements

- Semantic HTML.
- Visible keyboard focus.
- Form labels and understandable errors.
- Contrast suitable for small text.
- Status icon/text in addition to color.
- Keyboard-accessible menus, dialogs, and drawers.
- Correct focus management for modal dialogs.
- Reduced-motion support.
- Graph text alternative.
- Charts with accessible labels or data summaries.
- No essential information available only on hover.

## 12. Visual quality gates

A page is not visually complete until:
- It has been compared with the correct Figma frame.
- Major spacing and alignment match.
- Typography hierarchy matches.
- Colors, borders, radius, and icons match.
- No unapproved visual additions exist.
- Responsive behavior is checked at 1440, 1024, and 390 px.
- Empty/loading/error/success states use the same design system.
- All displayed sample data is clearly synthetic.
- No dead controls remain.

### Screenshot review
When browser tooling exists:
1. Capture the implemented page at the same viewport as the Figma frame.
2. Compare side-by-side or use a visual diff.
3. Record mismatches by severity.
4. Fix high-impact differences first: layout, spacing, typography, color, then micro-details.
5. Repeat after changes.

Do not report pixel-perfect fidelity without an actual comparison.

## 13. Change-control rules

Any requested UI change must specify:
- Screen/route affected.
- User or product reason.
- Figma frame or source reference.
- Shared components affected.
- Responsive impact.
- Test/review required.

If the prompt asks for a visual change that contradicts approved Figma, ask for clarification or document the deviation before changing it. For an unambiguous bug fix, correct the bug without broad redesign.

## 14. Definition of done

- Approved Figma screens are implemented.
- Shared tokens/components are reused.
- No arbitrary redesign or generic template replacement.
- Routes and navigation are correct.
- Interactions are functional or honestly marked unavailable.
- Synthetic data is consistent.
- Responsive layouts pass target viewport checks.
- Accessibility basics are verified.
- Visual comparison has been performed where tooling allows.
- Remaining deviations are recorded in `DESIGN_HANDOFF.md` and `IMPLEMENTATION_STATUS.md`.
