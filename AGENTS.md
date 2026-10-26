# AGENTS.md — GARDA-SIM AI Engineering Rules
## Instructions for Antigravity, Gemini, and coding agents

This file defines how coding agents must operate in this repository. It is a behavioral contract, not a substitute for PRD, design, architecture, or actual tests.

---

## 1. Mission

Implement GARDA-SIM AI as a maintainable, responsive, defensive cybersecurity web application that faithfully follows the approved Figma UI, `PRD.md`, `DESIGN.md`, and `ARSITEKTUR.md`.

The product uses synthetic evidence and fictional IT/OT virtual assets. It simulates candidate response strategies, evaluates impact, enforces deterministic safety constraints, and presents explainable recommendations for human review.

## 2. Mandatory reading order

At the beginning of a new task, read only what is needed, but respect this source hierarchy:

1. Current user request.
2. `PRD.md` for product requirements.
3. Actual Figma frame/export plus `DESIGN.md` for UI.
4. `ARSITEKTUR.md` for system boundaries and data flow.
5. `SKILLS.md` for task execution and token-efficiency practices.
6. `IMPLEMENTATION_STATUS.md`, `ROUTE_INVENTORY.md`, and relevant ADRs for current state.
7. Existing source code and tests.

Do not assume files or connectors exist. Verify them.

If files conflict, record the conflict and resolve it explicitly. Never silently rewrite the product direction.

## 3. Initial task procedure

Before making changes:
1. Inspect repository structure and Git status.
2. Read current implementation and relevant tests.
3. Identify relevant Figma frame/export.
4. Identify the acceptance criteria.
5. State a concise plan and expected changed files.
6. Confirm no destructive operation is necessary.
7. Implement the smallest coherent slice.
8. Run relevant checks.
9. Inspect the diff and update status documentation.

If the task is a broad phase, prepare an implementation plan first. Do not spend tokens re-summarizing all project documents in the response.

## 4. Product and design constraints

- Figma exports are the visual source of truth.
- Do not redesign approved screens from scratch.
- Do not replace the UI with a generic template.
- Use design tokens and shared components.
- Do not invent metrics, customer logos, certifications, live telemetry, or benchmark results.
- Do not use decorative gradients, neon borders, excessive glassmorphism, Matrix effects, or unnecessary 3D.
- Every visible control must work, be clearly disabled, or be explicitly marked as prototype-only.
- Use the same synthetic dataset across the UI.
- Keep `SIMULATION ONLY` visible in the authenticated application.
- Do not imply connection to real military, OT, or production infrastructure.
- Respect accessibility, keyboard focus, contrast, and reduced-motion preferences.

If a UI state is not shown in Figma, extend the nearest approved pattern conservatively and record the inference in `DESIGN_HANDOFF.md`.

## 5. Architecture constraints

- Follow the approved `TECH_STACK_DECISION.md` once established.
- Do not introduce a competing framework without an ADR and explicit approval.
- Prefer a modular monolith for MVP over microservices.
- Keep route handlers thin.
- Keep business/domain logic outside UI components and route handlers.
- Keep simulation engine and safety policy independent of the AI provider.
- Use explicit schemas for API inputs and outputs.
- Keep database migrations and schema changes reviewable.
- Do not add a dependency without a concrete use case.
- Do not use a client-side flag as the sole authorization mechanism.
- Do not store credentials in source code.
- Do not implement unsupported integrations as fake success flows.

## 6. Security and safety rules

The application is a defensive simulation prototype.

Agents MUST NOT:
- Connect to real production systems or networks.
- Execute real containment actions.
- Isolate real hosts or accounts.
- Modify external systems as part of a simulation.
- Treat AI-generated text as a safety authorization.
- Let AI override deterministic policy results.
- Invent evidence IDs, telemetry, or experiment results.
- Log passwords, secrets, session tokens, or API keys.
- Expose stack traces or secret configuration to clients.
- Claim audit immutability, security certification, or real-world validation without evidence.

Agents MUST:
- Validate inputs on the server.
- Apply server-side authorization.
- Use safe session handling.
- Validate AI output against schemas and existing evidence.
- Test forbidden and boundary cases in the safety engine.
- Label synthetic data and simulated results.
- Record the scenario/topology/simulator/policy version for reproducibility.
- Preserve failures as failures.

## 7. Frontend rules

- Use TypeScript strict mode if the selected stack supports it.
- Keep components small enough to understand, but do not fragment every element into a file without reason.
- Reuse shared components.
- Keep domain logic out of presentation components.
- Implement loading, empty, error, disabled, and success states where relevant.
- Use semantic HTML and accessible labels.
- Use form validation with a shared schema when possible.
- Avoid broad global CSS overrides.
- Use Tailwind and shadcn/ui in a way that preserves Figma styling.
- Do not allow shadcn defaults to override approved design tokens.
- Use Motion for React, GSAP, and Three.js only for justified use cases.
- Never have two animation systems control the same element.
- Lazy-load heavy graph/3D modules when appropriate.

## 8. Backend rules

- Use typed request/response schemas.
- Validate and normalize inputs.
- Use transactions for multi-step writes.
- Keep authorization near the service/data boundary.
- Use pagination and filtering for growing lists.
- Avoid N+1 queries.
- Apply timeouts to external requests.
- Use bounded retries and rate limits.
- Use structured logs with correlation IDs.
- Keep external-provider calls behind an adapter.
- Provide a usable fallback if AI is not configured.
- Do not claim asynchronous job status unless a job system actually exists.

## 9. Database rules

- Use migrations; do not rely on manual undocumented schema changes.
- Name entities and fields consistently.
- Add indexes based on query patterns and foreign keys.
- Use database constraints for invariants that belong at the data layer.
- Keep scenario/topology versions traceable.
- Store run input/configuration snapshots where needed for reproducibility.
- Do not persist fake benchmark results as actual results.
- Keep demo seeds deterministic and clearly identified.
- Do not create unnecessary tables for speculative future features.

## 10. Testing rules

For every meaningful feature, determine the relevant test level:
- Unit tests for domain calculations and safety rules.
- Integration tests for API/database behavior.
- Component tests for critical UI behavior.
- E2E tests for primary user journeys.
- Screenshot comparison for visual fidelity where tools exist.

Never:
- Delete a test just to pass a build.
- Mock the exact behavior under test without testing the real contract.
- Report a check as passed unless it was run.
- Hide failing tests behind broad skip rules.
- Claim pixel-perfect UI without a comparison.

## 11. Token and context efficiency

- Start from `IMPLEMENTATION_STATUS.md`.
- Read relevant sections, not every document in full, unless starting a major phase.
- Use repository search to find the code path.
- Avoid repeated whole-file rewrites.
- Make focused diffs.
- Do not produce multiple competing implementations.
- Do not use multiple agents to edit the same core files concurrently.
- Summarize verified state in durable docs, not in long chat recaps.
- Do not claim guaranteed 80% token savings; optimize and measure actual usage.
- If context is missing, ask a targeted question only when it blocks safe progress.

## 12. Command/tool usage

If project commands such as `/arsitek`, `/designmd`, `/design`, or `/design-review` are available:
- Inspect their actual descriptions/capabilities before use.
- Use them only for their supported scope.
- Verify changes after execution.
- Do not assume a command has modified files just because it returned a summary.
- If unavailable, continue with ordinary repository tools and document the limitation.

Do not invent tool names, flags, or capabilities.

## 13. Git and filesystem safety

- Check Git status before changes.
- Preserve uncommitted user work.
- Do not run destructive cleanup, force reset, mass deletion, or history rewrite without explicit approval.
- Do not commit/push/deploy unless authorized by the user or established project instructions.
- Avoid editing generated files unless the task requires it.
- Do not replace whole configuration files when a small patch is enough.

## 14. Required status updates

Maintain `IMPLEMENTATION_STATUS.md` with:
- Current phase.
- Completed features with evidence.
- In-progress work.
- Blockers.
- Tests and commands actually run.
- Known limitations.
- Next logical step.

Maintain `ROUTE_INVENTORY.md` with route, auth requirement, implementation status, and state coverage.

Maintain `DESIGN_HANDOFF.md` with frame mapping, asset gaps, deviations, and screenshot-review status.

Use ADRs for major stack, authentication, database, or job-processing decisions.

## 15. Definition of done

Do not declare a task complete until:
- Acceptance criteria are met.
- Code changes are reviewed.
- Relevant tests and checks are run.
- UI is checked against Figma when applicable.
- Error/empty/loading states are handled.
- Security and safety constraints remain intact.
- Documentation and status are updated.
- Remaining limitations are explicitly listed.

## 16. Response format

Report only verified facts:
1. Implemented.
2. Files changed.
3. Checks run and actual outcomes.
4. Remaining issues or assumptions.
5. Next step.

Be concise. Do not repeat the entire PRD in every response.
