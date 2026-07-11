# Progress Event Acceptance Gate Write Intent Checks

## Scope

Run after persistence adapter, progress event storage, event taxonomy, launch-session event acceptance, backend schema, migration specs, hosted backend, or local classroom storage work.

## Checks

- Confirm progress-event write intents require a passed event acceptance gate.
- Confirm `packages/content-model/src/persistenceAdapter.ts` rejects student-data progress-event intents without `requiresEventAcceptanceGate`.
- Confirm `/teacher/intake` shows `Event acceptance` in the persistence adapter map.
- Confirm backend schema draft progress events include `event_acceptance_gate_id`.
- Confirm migration specs include `event_acceptance_gate_id` in `spec-progress-event`.
- Confirm event taxonomy still separates progress-affecting, report-only, and support-only activity.
- Confirm raw learner audio, transcripts, ungated AI Tutor state, and open-ended private notes remain outside progress-event storage.

## Verification Command

```powershell
npm run verify:foundation
```
