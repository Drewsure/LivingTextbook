# DR-216: Teacher Dry-Run Rehearsal Storage Contract

Date: 2026-07-15

## Decision

Add a backend-neutral storage contract for teacher dry-run rehearsal records.

## Rationale

The rehearsal preview is useful only if future pilot systems can preserve its evidence consistently. The record must support hosted and local deployment paths while blocking accidental live classroom behavior.

## Standard

- The record category is `teacher-dry-run-rehearsal`.
- The backend entity is `teacher_dry_run_rehearsal`.
- Hosted and local adapter plans must both include write intents.
- The record must preserve route, game/audio, media/support-language, report, and local fallback checks.
- The record must block student launch, real learner data collection, live progress storage, report export, raw learner audio, and learner transcripts.
