# DR-439: AI Prototype Patch Change Set Preview Validator

## Status

Accepted.

## Context

Patch implementation work-order previews can name future file groups, but planned file paths still need their own review-only guard before any generated or returned prototype can become app patch work.

## Decision

Add a shared `validateAiPrototypePatchChangeSetPreview` guard in the content model and require the teacher generator route to show its active guard, guard blocks, and guard warnings.

The guard requires planned file groups, future-only actions, invariant checks, review blockers, next records, no apply-patch action, no app patch write, and support-language boundaries.

## Consequences

- File-level change sets can be reviewed without enabling patch application.
- No apply patch, app patch write, generated file write, test execution, Playwright run, route creation, scoring or reward mutation, audio manifest mutation, package promotion, assignment, or support-language progress trigger is enabled.
- MiniStar Foundation Japanese support remains hiragana-only and support-only while English remains the progress trigger.
