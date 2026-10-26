# SECURITY_EXCEPTIONS.md — GARDA-SIM AI
## Security Exception Register and Risk Acceptance Log

**Document Status:** Active Register  
**Date:** 2026-10-26  
**Governing Documents:** `SECURITY.md`, `AGENTS.md`

---

## 1. Exception Policy

Any deviation from the security baseline outlined in `SECURITY.md` requires:
1. Documented Finding ID and Risk Level.
2. Concrete Business / Technical Rationale.
3. Named Security Owner & Approval.
4. Specific Compensating Controls.
5. Time-bounded Expiration / Review Date.

No Critical or High exploitable vulnerabilities may be accepted for production release without an approved exception.

---

## 2. Active Exceptions Register

| Exception ID | Date Added | Risk Category | Description | Rationale | Compensating Controls | Expiration Date | Owner / Status |
|---|---|---|---|---|---|---|---|
| **EXC-001** | 2026-10-26 | Local Persistence | Local development uses SQLite file persistence instead of multi-node PostgreSQL | Enables lightweight zero-dependency local development and testing | Database file is gitignored (`.gitignore`); production deployment will enforce PostgreSQL with environment variables | 2026-11-30 | Lead Architect / Approved (Dev Only) |
| **EXC-002** | 2026-10-26 | AI Provider Stub | Development environment supports deterministic fallback stub when LLM API keys are unset | Prevents build or test failures when external AI providers are unavailable or offline | Synthetic stub generates reproducible, static explanations strictly validated against Pydantic schema | Permanent (Dev Fallback) | Lead Architect / Approved |

---

## 3. Retired / Resolved Exceptions
*(None at this stage)*
