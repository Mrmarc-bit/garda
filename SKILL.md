# SKILLS.md — GARDA-SIM AI Agent Operating Skills
## Context-efficient, evidence-first, maintainable implementation

**Purpose:** Give Antigravity/Gemini a repeatable operating method for working on GARDA-SIM AI with low context waste and high adherence to the approved requirements and UI.

> **Token-efficiency note:** No workflow can guarantee an 80% token reduction or a specific output quality in every run. This document uses compact context loading, targeted file reads, incremental tasks, and reusable contracts to reduce avoidable context and rework. Measure actual usage in the chosen tool rather than claiming an unverified percentage.

---

## 1. Operating principles

1. **Read before edit.** Inspect the relevant files and existing implementation before changing code.
2. **Source hierarchy.** Use `PRD.md` for product requirements, `DESIGN.md` and Figma exports for UI, `ARSITEKTUR.md` for system boundaries, and `AGENTS.md` for workflow rules.
3. **Minimal context.** Load only files and sections needed for the current task. Do not repeatedly reread entire documents if a relevant summary or exact section is sufficient.
4. **Minimal diff.** Make the smallest coherent change that satisfies acceptance criteria.
5. **No silent invention.** If a requirement or UI state is absent, document the assumption and follow an adjacent approved pattern.
6. **No false completion.** A feature is complete only after implementation and verification.
7. **No gratuitous dependencies.** Inspect existing dependencies and justify additions.
8. **Keep project runnable.** Make incremental changes and run focused checks after each coherent unit.
9. **No AI slop.** Product-specific UI, accurate data, purposeful motion, and consistent design tokens are mandatory.
10. **Security and safety are code-level constraints.** Never delegate deterministic safety decisions to an LLM.
11. **Ask only blocking questions.** If uncertainty does not block safe progress, document an assumption and continue.
12. **Protect user work.** Never overwrite, delete, or reset unreviewed files or Git changes.

## 2. Canonical source hierarchy

When sources disagree:

1. Explicit current user instruction.
2. Approved Figma frame/export for visual decisions.
3. `PRD.md` for product scope and acceptance criteria.
4. `DESIGN.md` for UI tokens and component rules.
5. `ARSITEKTUR.md` for architecture and data boundaries.
6. `AGENTS.md` for agent behavior and workflow.
7. Existing implementation conventions that are known to work.
8. Conservative inference documented in the relevant handoff/decision file.

If two high-priority sources conflict, do not silently reconcile them. Record the conflict and ask only if the decision affects correctness or major rework.

## 3. Context-efficient workflow

### 3.1 Task framing
Before work, write a compact internal task brief:
- Goal.
- Relevant route/module.
- Source files to inspect.
- Acceptance criteria.
- Constraints.
- Tests to run.
- Out-of-scope items.

Do not regenerate the entire PRD in each task.

### 3.2 Read targeted context
- Start with `IMPLEMENTATION_STATUS.md`.
- Inspect the relevant source files and tests.
- Read only the relevant sections of PRD/DESIGN/architecture.
- Search for existing components and services before creating new ones.
- Use repository search instead of loading unrelated files.

### 3.3 Plan in small batches
Split work into a coherent vertical slice. Example:
1. Implement incident list API schema.
2. Add service and tests.
3. Connect UI.
4. Verify empty/loading/error states.
5. Update status documentation.

Avoid a single request to “build the whole app” after the audit. Large tasks increase drift, missed requirements, and repeated context.

### 3.4 Reuse verified summaries
Maintain:
- `IMPLEMENTATION_STATUS.md`: current verified state.
- `ROUTE_INVENTORY.md`: routes and state coverage.
- `DESIGN_HANDOFF.md`: Figma mapping and visual deviations.
- `TECH_STACK_DECISION.md`: approved stack and rationale.
- `ADR/`: important decisions.

Update these concise files after each phase. Do not create duplicate summaries in multiple locations.

### 3.5 Avoid unnecessary token use
- Do not repeat the full project brief in every prompt.
- Refer to canonical file names and exact sections.
- Prefer targeted diffs over entire-file rewrites.
- Do not ask the model to explain code it just generated unless review requires it.
- Avoid generating code for files that already satisfy acceptance criteria.
- Avoid speculative alternatives after a decision is approved.
- Run focused tests first, then broader checks at milestones.
- Do not ask for lengthy status prose; use a concise change summary plus evidence.
- Do not use multiple agents to independently rewrite the same files.
- Keep a single owner for shared design tokens, API contracts, and architecture decisions.

These practices may substantially reduce wasted context, but an “80% token savings” target is a hypothesis, not a guarantee.

## 4. Implementation loop

For every task, follow this loop:

### Step 1 — Inspect
- Check Git status.
- Read current implementation.
- Find related tests and components.
- Identify contracts and dependencies.

### Step 2 — State the plan
Write a short plan with files expected to change and verification commands. If the change is trivial and safe, a short plan is enough.

### Step 3 — Implement
- Make a minimal coherent change.
- Follow established naming and file conventions.
- Preserve public APIs unless the task requires changing them.
- Add no unrelated refactors.
- Do not hide errors with broad exception handling.

### Step 4 — Verify
Run the narrowest relevant test first. Then run lint/type checks or build when relevant.

### Step 5 — Review
Inspect the diff for:
- Scope creep.
- Inconsistent UI.
- Missing error states.
- Security regressions.
- Fake data or false claims.
- Unnecessary dependencies.
- Dead controls.
- Uncovered edge cases.

### Step 6 — Report
State:
- What changed.
- Files changed.
- Checks actually run and result.
- Remaining limitations.
- Next task.

Never say a command passed unless it was run and passed.

## 5. UI implementation skill

Before implementing a screen:
1. Locate its Figma frame/export.
2. Identify shared shell and components.
3. Extract spacing, typography, color, and responsive rules.
4. Map every visible control to an action.
5. Identify loading, empty, error, disabled, and success states.
6. Reuse existing components.
7. Implement the screen.
8. Compare screenshot with reference if tooling is available.
9. Update `DESIGN_HANDOFF.md` for unresolved differences.

Never invent a replacement layout because the screenshot is incomplete. Record missing details and use the closest approved pattern.

### UI review checklist
- Correct hierarchy and content order.
- Correct typography and alignment.
- Correct token use.
- No random gradients or decorative effects.
- No duplicated cards.
- No fake telemetry.
- No dead controls.
- Responsive at 1440/1024/390 px.
- Keyboard/focus behavior works.
- Reduced motion is respected.

## 6. Backend/API skill

- Define request and response schemas before connecting UI.
- Keep route handlers thin.
- Put domain logic in services/domain modules.
- Use transactions for multi-step database writes.
- Validate external input.
- Return a consistent error shape.
- Use pagination for growing datasets.
- Avoid N+1 queries.
- Do not expose internal stack traces.
- Use timeouts for external services.
- Make retries safe and bounded.
- Add correlation/run IDs to relevant logs.
- Never store secrets in source code.
- Do not trust client-side authorization.

## 7. Simulation and safety skill

The simulator operates only on synthetic data and fictional assets.

- Keep the simulation engine deterministic when possible.
- Version scenario, topology, simulator, and policy.
- Record random seeds if randomization exists.
- Define every metric and unit.
- Keep baseline data immutable; use scenario/run snapshots for variants.
- Evaluate safety rules in ordinary, testable code.
- AI can explain results but cannot set authoritative metrics or override policy.
- Test prohibited actions and boundary conditions.
- Store failures as failures; never convert them into successful results.
- Do not make real network or production changes.
- Keep a visible simulation-only disclaimer.

## 8. AI integration skill

- Call an AI provider only when the task needs it.
- Keep credentials server-side.
- Send the minimum necessary context.
- Do not send secrets or unnecessary personal data.
- Use structured output schemas.
- Validate evidence IDs against actual records.
- Treat model output as untrusted data.
- Bound prompt size, output size, retries, and timeouts.
- Do not retry indefinitely.
- Record provider/model metadata when allowed and useful.
- Provide a clear fallback when the provider is unavailable.
- Never fabricate that an AI call occurred.
- Never rely on an LLM to enforce access control or safety constraints.

### Context budgeting
Construct model context from:
- Current scenario summary.
- Relevant evidence records only.
- Relevant asset/dependency slice.
- Candidate strategies.
- Explicit response schema.
- Short policy summary.

Do not send the entire database, all historical logs, or all project documentation to the model for a single recommendation.

If evidence exceeds the context budget, retrieve relevant records by deterministic filtering or ranking and clearly report the scope used.

## 9. Testing skill

Choose tests based on risk.

- Domain calculations: unit tests.
- Database/API interaction: integration tests.
- Authentication and critical journeys: end-to-end tests.
- Visual fidelity: screenshot comparison.
- Safety constraints: table-driven tests covering allowed and prohibited cases.
- AI output: schema/contract tests and provider-failure tests.

Do not rely solely on snapshot tests for business logic. Do not delete or weaken tests to make a build pass.

At milestones, run:
1. Focused tests.
2. Lint.
3. Type checking.
4. Full tests.
5. Production build.
6. Browser smoke test where available.

## 10. Git and change safety

- Inspect `git status` before editing.
- Never discard uncommitted user changes.
- Do not run destructive cleanup without explicit authorization.
- Avoid broad format-only diffs.
- Keep changes focused.
- Do not commit or push unless the user or project workflow authorizes it.
- Never rewrite shared history without explicit permission.
- Explain any required migration or destructive operation before executing it.

## 11. Dependency decision skill

Before adding a package:
1. Check if current dependencies already solve the need.
2. Confirm framework/version compatibility.
3. Check maintenance status and licensing when practical.
4. Estimate bundle/runtime impact.
5. Add only if the benefit is concrete.
6. Pin or lock dependency versions using the project package manager.
7. Document the reason for unusual or high-impact dependencies.

Motion, GSAP, and Three.js must not be installed and used everywhere by default. Use them only where the approved design calls for them.

## 12. Definition of done

A task is complete when:
- Acceptance criteria are met.
- Existing work is preserved.
- Relevant tests are added or updated.
- Relevant checks are actually run.
- UI matches the approved design when applicable.
- Error and edge states are handled.
- No fake integrations or claims remain.
- Documentation/status is updated.
- The final report accurately reflects what was verified.

## 13. Standard concise completion report

Use this format:

- **Implemented:** concise feature summary.
- **Changed files:** file list.
- **Verification:** exact commands/checks and results.
- **Known limitations:** only verified outstanding issues.
- **Next step:** one logical next task.

Avoid long recaps of already-known requirements.
