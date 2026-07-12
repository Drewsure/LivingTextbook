# DR-147: Game Mode Coverage Verifier

## Decision

Make shared game mode catalog coverage an automated verification gate.

## Reason

The product must not grow into disconnected one-off games. Every shared mode needs engine ownership, scoring behavior, learner-audio requirements, and catalog metadata before it can become part of the white-label platform.

## Standard

- `npm run verify:game-modes` must pass.
- `npm run verify:foundation` runs game mode verification before typecheck/build/routes.
- Every shared `GameModeId` must appear in `gameModeCatalog`.
- Every shared `GameModeId` must have deterministic scoring profile mapping.
- Every shared `GameModeId` must require learner audio.
