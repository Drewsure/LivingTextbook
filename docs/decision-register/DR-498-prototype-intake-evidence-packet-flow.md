# DR-498: Prototype Intake Evidence Packet Flow

## Status

Accepted.

## Decision

Outside game inventory must show a prototype intake evidence packet flow before any controlled review can advance.

## Rationale

The prototype queue and storage guard identify candidates and storage boundaries. The next required foundation piece is the evidence structure that tells Z.ai, outside builders, Codex, and reviewers what must be returned before wrapper review is even discussed.

The flow reuses the existing evidence packet pattern instead of creating a special one-off prototype system.

## Required Evidence Lanes

- Source snapshot.
- Fixture replay.
- Event and scoring replay.
- Target-language audio coverage.
- Mobile accessibility.
- Wrapper boundary.

## Boundaries

- No prototype upload or import.
- No app file write.
- No active route replacement.
- No scoring profile mutation.
- No reward inventory write.
- No playlist write.
- No package promotion.
- No student assignment.
- No support-language progress trigger.

## Verification

- `npm run verify:prototype-review`
- `npm run verify:routes`
