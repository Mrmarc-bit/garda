# PRD Addendum — Consistency, Implementation Control, and Evaluation

This addendum supplements `PRD.md` and should be merged into the main PRD only if the repository owner wants a single file. It does not replace the original requirements.

## A. Document authority

- `PRD.md`: product requirements, scope, priority, acceptance criteria.
- `DESIGN.md`: visual contract and screen-specific design rules.
- Figma exports: source of truth for approved visual layout.
- `ARSITEKTUR.md`: module boundaries, data flow, persistence, API, security.
- `AGENTS.md`: non-negotiable coding-agent rules.
- `SKILLS.md`: context-efficient working method.
- `IMPLEMENTATION_STATUS.md`: verified current implementation state.
- `ROUTE_INVENTORY.md`: route-level implementation coverage.
- `DESIGN_HANDOFF.md`: Figma-to-code mapping and visual deviations.
- `TECH_STACK_DECISION.md`: approved stack decision.
- ADR files: long-lived technical decisions.

## B. Requirements traceability

Every P0 requirement should map to:
1. One or more route/component/module.
2. A data/API contract if applicable.
3. Acceptance criteria.
4. A test or explicit verification method.
5. Current status.

Suggested fields for a traceability table:
`Requirement ID | Requirement | UI route | Backend module | Test | Status | Evidence`.

Do not mark a requirement complete solely because a file exists.

## C. MVP prioritization

If time is limited, preserve this order:
1. Accurate Figma-based shell and public/authenticated routing.
2. Server-backed authentication and consistent synthetic dataset.
3. Incident/evidence investigation.
4. Deterministic simulator and safety policy.
5. Reproducible strategy comparison.
6. AI explanation with fallback.
7. Human review and audit trail.
8. Experiments and reports.
9. Secondary marketing pages and nonessential animation polish.

Do not remove the core safety and simulation logic in favor of extra visual effects.

## D. Evaluation validity

Before claiming a method performs better:
- Define each baseline.
- Fix or document the scenario dataset.
- Define metrics and their units.
- Run the same scenarios across compared methods.
- Record simulator, policy, and dataset versions.
- Report sample size and missing/failed runs.
- Explain limitations.
- Avoid causal claims that the evaluation design cannot support.

## E. UI consistency gate

A screen must not be approved if:
- It conflicts with the corresponding Figma frame without documented reason.
- It introduces an unapproved design system.
- It contains dead controls.
- It shows fabricated metrics as real.
- It uses inconsistent incident or asset identifiers.
- It omits relevant loading/error/empty states.
- It breaks responsive layout or keyboard interaction.

## F. AI usage and context efficiency

No fixed token-saving percentage is guaranteed. Use:
- Targeted reads.
- Small vertical slices.
- A durable status file.
- Shared contracts.
- Minimal diffs.
- Focused tests.
- One owner per shared contract.
- Explicit scope boundaries.
- No repeated full-project summaries.

Measure actual tool usage and output quality if token efficiency is a project KPI.

## G. Final release checklist

- [ ] Figma-to-route mapping complete.
- [ ] Stack and auth decisions documented.
- [ ] All P0 requirements traceable.
- [ ] Synthetic data labeled consistently.
- [ ] Safety rules tested independently of AI.
- [ ] Main user journeys pass.
- [ ] Design comparison performed.
- [ ] Accessibility and responsive checks performed.
- [ ] Tests, lint, type checks, and build results recorded.
- [ ] No secrets or fabricated integrations.
- [ ] Limitations and known issues documented.
- [ ] Demo walkthrough reflects actual behavior.
