# DESIGN_HANDOFF.md — GARDA-SIM AI
## Design Tokens, Responsive Rules, Shared Components, and Visual Fidelity Handoff

**Status:** Verified Design Specification  
**Date:** 2026-10-26  
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
