# ADR 1121: Adult Observation Adjudication

## Decision

Add an explicit, browser-local adjudication record for the exact observation
handoff shown on release-readiness review. The reviewer may record only
`accepted-for-next-gate` or `blocked`, with a reviewer reference and note.

## Boundaries

The record is review-only. It does not approve a release, write hosted
persistence, export evidence, mutate QR routes, assign students, or launch
students. It must preserve every identity from the source handoff and reject
tenant or handoff drift.

## Verification

- `npm run verify:browser-rehearsal-observation-adjudication`
- `npm run typecheck --workspace @living-textbook/web`
- Full foundation verification before publication.
