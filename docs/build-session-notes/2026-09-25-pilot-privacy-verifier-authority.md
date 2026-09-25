# Build Session: Pilot Privacy Verifier Authority

## Goal

Restore the full foundation gate by aligning a pilot privacy assertion with the
contract that owns the assertion.

## Implemented

- Repointed raw learner audio and transcript exclusion checks to
  `backupManifest.ts`.
- Kept durable operations policy checks in
  `sqliteProgressionOperations.ts`.
- Added standing ADR and decision-register records.

## Boundaries

No runtime persistence, report, audio, learner, deployment, or Z.ai source
behavior was changed.

## Verification

Run the pilot rehearsal verifier and then the complete foundation gate.
