# ADR 1219: Pilot Privacy Verifier Authority

**Status:** Accepted  
**Date:** 2026-09-25

## Context

The pilot rehearsal gate checks that persistence and recovery exclude raw
learner audio and learner transcripts. Those fields are authoritative in the
validated backup-manifest contract, not in the SQLite operations coordinator.
The verifier had drifted toward the coordinator file and therefore reported a
false failure during the full foundation run.

## Decision

The pilot rehearsal verifier must inspect the authoritative backup-manifest
contract for `rawLearnerAudioExcluded: true` and
`learnerTranscriptsExcluded: true`, while checking the SQLite operations class
only for its policy-gate behavior. Verifiers must follow contract ownership
rather than duplicate implementation text.

## Consequences

- The foundation gate now fails only when the privacy contract itself drifts.
- Runtime behavior remains unchanged.
- Future contract moves require an explicit verifier update and decision record.

## Verification

`node scripts/verify-pilot-session-rehearsal.mjs` covers the corrected source
ownership, and `npm run verify:foundation` remains the broad gate.
