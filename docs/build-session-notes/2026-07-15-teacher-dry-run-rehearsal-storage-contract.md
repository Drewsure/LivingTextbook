# Build Session Note: Teacher Dry-Run Rehearsal Storage Contract

Date: 2026-07-15

## Change

Added the storage contract for `teacher_dry_run_rehearsal`.

## Why

The teacher dry-run rehearsal needs durable backend-neutral metadata before real classroom pilot workflows are enabled. This keeps the future pilot auditable without collecting real learner data or turning rehearsal evidence into live progress.

## Verification

- Backend schema entity: `teacher_dry_run_rehearsal`
- Migration candidate: `m033-teacher-dry-run-rehearsal-records`
- Migration spec: `spec-teacher-dry-run-rehearsal`
- Durable record: `teacher-dry-run-rehearsal-record`
- Hosted write intent: `hosted-teacher-dry-run-rehearsal-write`
- Local write intent: `local-teacher-dry-run-rehearsal-write`

## Boundary

The record does not launch students, collect real learner data, store live progress, export reports, store raw learner audio, or store learner transcripts.
