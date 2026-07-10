# ADR 0089: Teacher Training Recovery Trigger Settings

## Status

Accepted

## Context

Training Academy recovery exists as a deterministic local-state lane. The next foundation step is to expose the trigger policy to teachers without implying that live classroom settings are already persisted.

## Decision

Add Training Academy trigger thresholds to `TeacherSessionSettings`, validate deterministic recovery rewards, and surface the settings in the teacher session monitor.

## Consequences

Teachers can see why recovery may be recommended. Persistence remains required before teacher-adjustable thresholds are reliable across devices. AI Tutor stays out of the core recovery trigger.

