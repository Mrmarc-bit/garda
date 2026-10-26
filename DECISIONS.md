# DECISIONS.md — GARDA-SIM AI
## Architectural, Design, Security, and Scope Decision Log

**Project:** GARDA-SIM AI — AI-Assisted Cyber Defense Response Simulator  
**Last Updated:** 2026-10-26

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
