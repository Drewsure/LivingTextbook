# DR-438: AI Prototype Patch Implementation Work Order Validator

## Status

Accepted.

## Context

Patch authorization release locks still do not permit code work. A work-order preview can narrow future file groups and verification order, but it must remain non-executable until later release-control gates exist.

## Decision

Add a shared `validateAiPrototypePatchImplementationWorkOrder` guard in the content model and require the teacher generator route to show its active guard, guard blocks, and guard warnings.

The guard requires required-before-work records, removable future file groups, dry-run verification order, rollback plan, next records, no work order execution, and support-language boundaries.

## Consequences

- Future patch work can be scoped without enabling work execution.
- No work order execution, app file write, patch generation, test execution, Playwright run, route mutation, student-facing route, scoring or reward mutation, audio manifest mutation, package promotion, assignment, or support-language progress trigger is enabled.
- MiniStar Foundation Japanese support remains hiragana-only and support-only while English remains the progress trigger.
