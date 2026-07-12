# Persistence Durable Event Acceptance Checks

## Scope

Run after durable record, persistence boundary, event storage, report package, backend schema, migration specs, hosted backend, or local storage work.

## Checks

- Confirm `packages/content-model/src/persistenceRecords.ts` validates progress-event taxonomy preservation.
- Confirm `packages/content-model/src/persistenceRecords.ts` validates progress-event event acceptance gate requirements.
- Confirm `packages/content-model/src/persistenceRecords.ts` validates teacher report package event acceptance summary preservation.
- Confirm `/teacher/intake` durable record map shows event safety for progress-event records.
- Confirm `/teacher/intake` durable record map shows report event acceptance for teacher report package records.
- Confirm raw learner audio, transcripts, ungated AI Tutor state, and support-only mastery credit remain blocked.

## Verification Command

```powershell
npm run verify:foundation
```
