# DR-138: Teacher Session Settings Storage Contract

## Decision

Promote teacher session settings snapshots into the persistence adapter contract, backend schema draft, migration candidates, and migration specs.

## Reason

Teacher choices for audio, assist language, microphone practice, background media, Training Academy recovery, AI Tutor, and reporting must travel reliably across student devices. A future backend or local store must preserve those choices before real classroom reporting begins.

## Standard

- Launch-session write intents must preserve teacher session settings snapshots.
- Hosted and local adapter plans include launch-session settings write paths.
- Backend schema draft includes `settings_snapshot`, `settings_validation`, and `settings_revision`.
- Migration specs include `spec-launch-session-settings`.
- Support language, background media, and route guidance remain non-scoring.
- Raw microphone audio, transcripts, and ungated AI Tutor state remain outside core launch-session settings.
