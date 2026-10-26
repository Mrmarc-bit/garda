# TECH_STACK_DECISION.md — GARDA-SIM AI
## Architectural Decision Record: Baseline Technology Stack

**Document status:** Approved Architecture Baseline  
**Date:** 2026-10-26  
**Authors:** Principal Software Architect & Full-Stack Engineering Team  
**Governing Documents:** `PRD.md`, `DESIGN.md`, `ARSITEKTUR.md`, `SECURITY.md`, `AGENTS.md`

---

## 1. Context and Problem Statement

GARDA-SIM AI is a defensive cyber incident response simulation platform. It requires:
1. High-fidelity rendering of 60 Figma-approved screens across Desktop (1440px), Tablet (1024px), and Mobile (390px).
2. Deterministic simulation of incident response actions and virtual IT/OT topology impact.
3. Deterministic safety policy validation independent of AI outputs.
4. AI-assisted explanation and evidence synthesis with fallback mechanisms.
5. Strict local reproducibility, audit trails, and security boundary enforcement.

The repository initially contained project documentation and Figma UI image exports without an application skeleton or package manifest.

---

## 2. Evaluated Options

### Option A: Monorepo with Separated Next.js Frontend (`apps/web`) and FastAPI Backend (`apps/api`)
- **Frontend:** Next.js (App Router, React 19 / 18, TypeScript strict mode, Tailwind CSS v3/v4, Radix Primitives / shadcn/ui, Lucide Icons, Zod).
- **Backend:** Python 3.15, FastAPI, Pydantic v2, SQLAlchemy 2.x, Alembic, SQLite / PostgreSQL, Pytest.
- **Pros:**
  - Matches `ARSITEKTUR.md` Section 2/3 target architecture directly.
  - Python ecosystem provides direct support for analytical simulation, graph operations (NetworkX), and AI integrations (LiteLLM, LangChain, or native provider SDKs).
  - Clean boundary between presentation and simulation/safety calculation.
- **Cons:**
  - Requires orchestrating two runtime processes during development.
  - Cross-process API calls require contract synchronization.

### Option B: Unified Next.js Full-Stack Application (Modular Monolith)
- **Frontend & API:** Next.js App Router (TypeScript, Tailwind CSS, Radix UI, Route Handlers, Prisma or Drizzle ORM, SQLite / PostgreSQL).
- **Simulation:** TypeScript deterministic engine.
- **Pros:** Single runtime, unified build, rapid initial UI iteration.
- **Cons:** Deviates from `ARSITEKTUR.md` which specifically designates Python/FastAPI for the analytical simulation engine and backend services.

---

## 3. Decision Outcome

**Decision:** Adopt **Option A (Modular Monolith / Two-Tier Monorepo)** structured as:
- `apps/web`: Next.js (App Router, TypeScript strict, Tailwind CSS, shadcn/ui & Radix primitives, Lucide React).
- `apps/api`: Python FastAPI service for deterministic simulation, safety engine, synthetic scenario management, and AI adapter.
- `packages/shared-data` or shared schemas: JSON schemas ensuring synchronous contract alignment between UI and API.

### Interim Milestone 1 Strategy:
For **Milestone 1 (Foundation and Design-System Fidelity)**, we will initialize `apps/web` with Next.js App Router, configure design tokens, layout shells, and UI components matching the 60 Figma references, accompanied by local synthetic fixtures so UI verification can proceed without blocking on backend persistence. In parallel, `apps/api` will be initialized for the deterministic simulation engine in Milestone 3 & 4.

---

## 4. Technology Stack Specification

| Layer | Selected Technology | Version / Specification | Rationale |
|---|---|---|---|
| **Web Framework** | Next.js (App Router) | v15.x / React 19 | Standard React SSR/SSG, fast routing, aligned with Figma layouts |
| **Language** | TypeScript | `^5.x` (strict: true) | Strict type checking, zero untyped code |
| **Styling** | Tailwind CSS | `^3.4.x` | Direct token mapping from `DESIGN.md` (no generic overrides) |
| **Component Primitives** | Radix UI / shadcn/ui | Latest stable | Accessible, unstyled primitives conforming to Figma frames |
| **Iconography** | Lucide React | Latest stable | Matches Figma iconography across navigation and status |
| **Validation** | Zod | `^3.23.x` | Runtime schema validation for forms, route params, API responses |
| **Animation** | Motion for React (framer-motion) | `^11.x` | Purposeful micro-interactions, drawer transitions |
| **Topology Graph** | React Flow / @xyflow/react | `^12.x` | 2D IT/OT virtual topology visualizer with custom nodes |
| **Backend API** | Python FastAPI | Python 3.15+ / FastAPI `^0.115` | Fast ASGI framework with Pydantic validation |
| **Domain Validation** | Pydantic v2 | `^2.9.x` | Strict validation for incident evidence and simulation schemas |
| **Persistence (API)** | SQLAlchemy 2.0 + SQLite (dev) / PostgreSQL (prod) | SQLAlchemy `^2.0` | Transactional persistence for scenarios, experiments, audit |
| **Testing** | Vitest / Testing Library (Web), Pytest (API) | Latest stable | Fast unit and integration test coverage |

---

## 5. Security and Compatibility Guarantees

1. **No External Live Telemetry:** All simulation calculations and virtual assets remain synthetic.
2. **Deterministic Safety:** Safety policy enforcement executes in dedicated Python modules with 100% test coverage before AI evaluation.
3. **Environment Isolation:** Next.js client bundles never expose API keys or backend secrets.
4. **Clean Dependencies:** No gratuitous dependencies. Every added library must directly serve an approved Figma screen or PRD requirement.
