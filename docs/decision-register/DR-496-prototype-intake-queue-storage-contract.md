# DR-496: Prototype Intake Queue Storage Contract

## Status

Accepted.

## Decision

Prototype intake queue items must be modeled as backend-neutral hosted/local storage contracts before any Z.ai or outside game inventory can become return-review, wrapper-review, route, scoring, reward, playlist, package, or assignment work.

## Rationale

The platform will eventually need to review useful outside game builds, including Z.ai work in `Drewsure/ministar-lab`. The foundation must not treat those prototypes as direct app code. A durable queue item gives Codex and future reviewers an audit-ready inventory record with tenant scope, repository scope, game mode, parent engine, target surface, priority, status, review route, required evidence, missing evidence, blocked actions, and Codex review ownership.

This keeps the path open for future game reuse while preserving the white-label architecture and preventing ad hoc imports.

## Boundaries

- No direct prototype import.
- No app file write.
- No active route replacement.
- No scoring profile mutation.
- No reward inventory write.
- No playlist write.
- No package promotion.
- No student assignment.
- No support-language progress trigger.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:prototype-review`
- `npm run verify:routes`
