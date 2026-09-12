# Progression Continuity Checks

## Automated

- `npm run verify:progression-runtime` passes the shared continuity markers.
- `npm run verify:runtime-behavior` accepts the valid sample envelope.
- The runtime harness rejects cross-tenant continuity, support-language
  evidence, and completed modes that are not unlocked.
- `npm run verify:routes` checks the teacher intake continuity review surface
  alongside all active student and teacher routes.

## Required Review

- The teacher intake page shows `Envelope valid`, `Review-only`, and `No side
  effect` for the sample continuity envelope.
- Source and destination routes are app-relative and the snapshot preserves
  tenant, package, launch, learner session, unit, cursor, unlocks, completion,
  Star Dust, and mastery state.
- No continuity control writes learner state, changes a QR URL, activates a
  game, or promotes an external Phaser/Z.ai candidate.
