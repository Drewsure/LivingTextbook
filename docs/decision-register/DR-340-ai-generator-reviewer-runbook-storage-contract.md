# DR-340: AI Generator Reviewer Runbook Storage Contract

## Decision

Promote `ai_generator_reviewer_runbook` / `ai-generator-reviewer-runbook` into the backend-neutral storage contract.

## Why

The visible reviewer runbook is useful only if future hosted/local pilots preserve its review order, evidence requirements, and blocked shortcuts. It must not become a checklist that grants live generation, app patching, package assembly, route creation, playlist creation, local bundle writes, assignment, or student-ready state.

## Guardrails

- Preserve human review order.
- Preserve standing rules.
- Preserve evidence lanes and required record ids.
- Preserve target-language trigger and assist-language support-only rules.
- Block live model calls, app patches, generated package assembly, route writes, playlist writes, local bundle writes, assignments, and student-ready markers.

## Verification

- `scripts/verify-backend-storage-readiness.mjs`
- `scripts/verify-active-routes.mjs`
- `npm run verify:foundation`
