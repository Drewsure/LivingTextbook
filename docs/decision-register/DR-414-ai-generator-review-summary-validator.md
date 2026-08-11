# DR-414: AI Generator Review Summary Validator

Date: 2026-08-11

## Decision

AI generator review summaries now use a shared content-model validator before the top rollup can inform future live generation, app patching, package assembly, route creation, playlist creation, local bundle writes, assignment, or student-ready marker work.

## Rationale

The review summary is the first thing a teacher or reviewer sees on the generator route. If it drifts, users can misunderstand the state of the whole generated package. The shared guard keeps the rollup review-only, blocked while any section is blocked, and aligned with the detailed gate surfaces underneath it.

## Rules Preserved

- Required sections are generator request, prototype review, integration gates, package review, and draft repair.
- Summary status stays blocked while any section is blocked.
- The current boundary must state the review-only status.
- Every section must include a primary blocker, next required record, blocked actions, and source records.
- Blocked action coverage must include live model calls, app files, package assembly, routes, student assignment, harness implementation, AI draft auto-fix, and live AI regeneration.

## Consequences

Teacher generator routes now surface `Review summary guard active`, `Review summary guard blocks`, and `Review summary guard warnings`. `verify:ai-generator` fails if the shared validator, sample guard exports, or visible guard labels are removed.
