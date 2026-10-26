# SECURITY_TEST_PLAN.md — GARDA-SIM AI
## Application Security Testing Plan and Verification Gates

**Document Status:** Approved Baseline / Version 1.0  
**Date:** 2026-10-26  
**Governing Documents:** `SECURITY.md`, `THREAT_MODEL.md`, `AGENTS.md`

---

## 1. Testing Scope and Objectives

Ensure GARDA-SIM AI complies with the mandatory requirements defined in `SECURITY.md`, including authentication safety, server-side authorization, input validation, deterministic safety invariants, and secret protection.

---

## 2. Test Suites and Automated Checks

### 2.1 Static Analysis & Dependency Vulnerabilities
- **Secret Scanning:** Verify no `.env`, API keys, private keys, or passwords committed to Git.
- **Dependency Audit:** Run `npm audit` and `pip-audit` / safety check before every release gate.
- **Lint & Type Checks:** Strict TypeScript compiler checks (`tsc --noEmit`), ESLint security plugins.

### 2.2 Functional Security & Invariant Tests

| Test ID | Category | Objective | Verification Method | Target Milestone |
|---|---|---|---|---|
| **SEC-01** | **Authentication** | Reject invalid passwords, enforce rate limiting on `/login` | Automated integration test with mock invalid attempts | Milestone 1/3 |
| **SEC-02** | **Session Security** | Ensure session tokens are HTTP-only, Secure, SameSite, and invalidated on logout | Automated HTTP header inspection test | Milestone 1/3 |
| **SEC-03** | **Authorization (IDOR)** | Verify user A cannot read or mutate user B's simulation runs or reports | Automated multi-user API test | Milestone 3 |
| **SEC-04** | **Safety Invariant** | Ensure deterministic safety engine blocks prohibited responses even if AI recommends them | Pytest unit tests for safety policy evaluator | Milestone 4 |
| **SEC-05** | **Input Sanitization** | Ensure malicious payloads (XSS, SQLi, command injection) in scenario data are rejected or escaped | Unit tests with fuzz payloads | Milestone 3 |
| **SEC-06** | **AI Output Validation** | Ensure malformed AI responses or prompt injection payloads are rejected by schema validators | Pydantic schema validation tests | Milestone 5 |
| **SEC-07** | **Audit Integrity** | Ensure critical actions (scenario load, simulation run, approval) generate immutable audit records | Integration test inspecting audit log generation | Milestone 6 |

---

## 3. Release Gate Criteria

A milestone cannot be marked `Verified` or `Complete` unless:
1. All relevant security test cases pass.
2. Zero High or Critical unmitigated vulnerabilities exist in dependencies.
3. No secrets are present in source files or client-side bundles.
4. The `SIMULATION ONLY` banner is verified present across all authenticated UI views.
