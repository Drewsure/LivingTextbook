# Teacher Session Event Acceptance Storage Checks

## Scope

Run after launch-session storage, event acceptance gates, event stream persistence, report policy, roster identity, backend schema, migration specs, or local deployment work.

## Checks

- Confirm launch-session write intents preserve event acceptance gates.
- Confirm backend schema draft includes `event_acceptance_gate`.
- Confirm backend schema draft includes `live_event_storage_allowed`.
- Confirm migration specs include event acceptance fields in `spec-launch-session-settings`.
- Confirm live event storage is derived from gate status and policy readiness, not a manual toggle.
- Confirm support-language, background-media, and route-guidance events remain non-scoring.
- Confirm raw learner audio, transcripts, and ungated AI Tutor state remain outside launch-session storage.

## Verification Command

```powershell
npm run verify:foundation
```
