# Teacher Session Settings Storage Checks

## Scope

Run after launch-session settings, persistence adapter, backend schema, migration candidate, migration spec, microphone, AI Tutor, background media, assist-language, or reporting changes.

## Checks

- Confirm launch-session write intents preserve teacher session settings snapshots.
- Confirm hosted adapter plans include launch-session settings writes.
- Confirm local adapter plans include launch-session settings writes.
- Confirm backend schema draft includes `settings_snapshot`, `settings_validation`, and `settings_revision`.
- Confirm backend migration candidates mention non-scoring support language and background media.
- Confirm backend migration specs include `spec-launch-session-settings`.
- Confirm raw microphone audio, learner transcripts, and ungated AI Tutor state are forbidden in core launch-session records.
- Confirm student events should not be accepted for live classroom use until launch-session settings are persisted.

## Verification Command

```powershell
npm run verify:foundation
```
