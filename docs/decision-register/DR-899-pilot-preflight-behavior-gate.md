# DR-899: Pilot Preflight Behavior Gate

## Decision

Add executable behavior verification for the pilot session preflight. The
gate must prove that complete evidence is review-ready, incomplete evidence
stays incomplete, privacy violations are invalid, and no state authorizes
launch or durable writes.

## Included

- Temporary TypeScript compilation of the preflight and evidence-envelope
  modules using the repository's own compiler.
- Deterministic assertions for ready, incomplete, invalid, launch-blocked, and
  durable-write-blocked results.
- A package script included in the canonical game verification path.

## Excluded

- Classroom launch, live student data, reward mutation, export, or any write to
  hosted or local persistence.

## Evidence

- `scripts/verify-pilot-session-preflight-behavior.mjs`
- `apps/web/src/features/persistence/pilotSessionPreflight.ts`
- `apps/web/src/features/persistence/pilotSessionEvidenceEnvelope.ts`

See `docs/adr/0827-pilot-preflight-behavior-gate.md` and
`docs/verification/PILOT_SESSION_PREFLIGHT_CHECKS.md`.
