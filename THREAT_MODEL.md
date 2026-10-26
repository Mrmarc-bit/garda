# THREAT_MODEL.md — GARDA-SIM AI
## Threat Model and Risk Assessment

**Document Status:** Initial Baseline / Version 1.0  
**Date:** 2026-10-26  
**Governing Documents:** `SECURITY.md`, `PRD.md`, `ARSITEKTUR.md`  
**Methodology:** STRIDE / OWASP Top 10 / OWASP API Security Top 10

---

## 1. System Overview & Trust Boundaries

GARDA-SIM AI is a defensive cybersecurity decision-support web application providing incident response simulations on synthetic data.

### 1.1 Trust Zones
1. **Untrusted Zone:** Public Internet, Web Browsers, unauthenticated users.
2. **Semi-Trusted Zone:** Authenticated Operators / Reviewers (via session cookie or JWT).
3. **Application Control Plane:** Next.js Web App / API Handlers.
4. **Deterministic Core:** Python Simulation Engine & Safety Policy Engine.
5. **Data Plane:** Database (PostgreSQL / SQLite) storing scenarios, evidence, user profiles, audit logs.
6. **External Zone:** Third-party AI Provider APIs (Anthropic, OpenAI, or synthetic local stub).

### 1.2 Non-Negotiable Boundary Constraints
- **Zero Real-World Execution:** The simulator CANNOT execute live network containment, firewall modification, or account termination.
- **Safety Enforcement Independence:** Deterministic safety rules run independently of and prior to AI explanation; AI outputs cannot override safety policy outcomes.
- **Input Neutralization:** All external payloads, scenario definitions, and user inputs are untrusted and strictly schema-validated.

---

## 2. STRIDE Threat Analysis

| Threat ID | STRIDE Category | Threat Description | Affected Component | Risk | Compensating Controls | Verification Status |
|---|---|---|---|---|---|---|
| **TM-01** | **Spoofing** | Unauthorized user assumes identity of an operator or auditor | Auth Service, Session Handler | High | Secure, HTTP-only, SameSite cookies or signed tokens; password hashing with Argon2id or bcrypt; rate-limited login | Implemented, Not Verified (Pending Milestone 1/3) |
| **TM-02** | **Tampering** | Malicious alteration of scenario definitions, topology graphs, or simulation seeds | API Endpoints, Database | High | Server-side schema validation (Pydantic/Zod); parameterized database queries; cryptographic hash on scenario seed versions | Implemented, Not Verified |
| **TM-03** | **Repudiation** | Operator approves simulated response or alters configuration without audit log | Audit Service | Medium | Append-only audit trail logging actor ID, timestamp, action type, IP, and event payload | Implemented, Not Verified |
| **TM-04** | **Information Disclosure** | Leakage of API keys, model prompts, internal stack traces, or session tokens in client bundles | Web Frontend, API Error Handlers | Critical | Strict environment variable separation (`NEXT_PUBLIC_` restricted to public vars); global error handler masking stack traces | Verified (In Configuration) |
| **TM-05** | **Denial of Service** | Resource exhaustion via complex graph traversal or recursive simulation calculations | Simulation Engine, API | Medium | Input limits on graph node/edge counts; request timeouts; API rate limiting | Implemented, Not Verified |
| **TM-06** | **Elevation of Privilege** | Standard operator attempts administrative configuration or bypasses safety constraints | AuthZ Middleware, Safety Engine | Critical | Server-side role-based authorization; deterministic safety constraints enforced at service layer, completely isolated from client control | Implemented, Not Verified |
| **TM-07** | **Prompt Injection** | Adversary injects malicious instructions inside synthetic log/evidence fields to manipulate AI explanation | AI Adapter | High | Structured schema validation of AI outputs; prompt sandboxing; explicit AI role framing; output parsing against strict Pydantic models | Implemented, Not Verified |

---

## 3. High-Priority Risk Register

1. **Risk 1: Accidental Perception of Real System Control**
   - *Impact:* Operator believes simulation action executes real-world isolation.
   - *Mitigation:* Persistent, unhideable `SIMULATION ONLY` badge across all authenticated headers; clear disclaimers on all action buttons; absence of real production credentials or network connectors.
2. **Risk 2: AI Hallucination of Evidence or Metrics**
   - *Impact:* User relies on fabricated metrics not calculated by the deterministic simulator.
   - *Mitigation:* Clear separation: authoritative metrics calculated by Python engine; AI restricted to summarizing and explaining provided data with verifiable citations.
