# Teacher Session Settings Storage Checks

## Scope

Run after launch-session settings, persistence adapter, backend schema, migration candidate, migration spec, microphone, AI Tutor, background media, assist-language, or reporting changes.

## Checks

- Confirm launch-session write intents preserve teacher session settings snapshots and settings review packets.
- Confirm hosted adapter plans include launch-session settings writes.
- Confirm local adapter plans include launch-session settings writes.
- Confirm backend schema draft includes `settings_snapshot`, `settings_review_packet`, `settings_validation`, and `settings_revision`.
- Confirm backend schema draft and migration specs preserve `assist_language_teacher_enablement_persisted`.
- Confirm backend migration candidates mention settings review packets, non-scoring support language, and background media.
- Confirm backend migration specs include `spec-launch-session-settings`.
- Confirm raw microphone audio, learner transcripts, and ungated AI Tutor state are forbidden in core launch-session records.
- Confirm student events should not be accepted for live classroom use until launch-session settings and their review packet are persisted.

## Verification Command

```powershell
npm run verify:foundation
```
