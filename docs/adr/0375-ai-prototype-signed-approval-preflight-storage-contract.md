# ADR 0375: AI Prototype Signed Approval Preflight Storage Contract

## Status

Accepted.

## Context

Tenant generator routes now expose review-only signed approval preflights. Those preflights name reviewer identity, approval scope locks, approval record draft fields, evidence checklist, cannot-approve blockers, and blocked approval actions before any signature capture or patch authorization can exist.

## Decision

Add a backend-neutral `ai_prototype_signed_approval_preflight` schema contract and matching `ai-prototype-signed-approval-preflight` durable record category.

Hosted and local adapters must preserve linked Codex patch approval decision, reviewer identity signature gate, route safety release gate, rollback drill record, storage contract verification, required identity lanes, scope locks, approval record draft fields, evidence checklist, cannot-approve blockers, next required records, and blocked approval actions.

## Consequences

- Future signed approval work has an auditable hosted/local record shape before approval capture exists.
- Hosted and closed-local deployments share the same signed approval preflight vocabulary.
- No signed approval capture, approve button, patch authorization, app file write, patch generation, test execution, Playwright run, route mutation, scoring or reward mutation, audio manifest mutation, package promotion, assignment, or support-language progress exists.
