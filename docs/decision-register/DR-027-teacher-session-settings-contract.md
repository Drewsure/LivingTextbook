# DR-027: Teacher Session Settings Contract

Status: Accepted  
Date: 2026-07-01

## Decision

Teacher session settings must be represented by a shared contract before production persistence or backend selection. The teacher monitor may render sample settings, but the rules themselves belong in shared content-model code.

## White-Label Impact

Strongly positive. Tenant policies for assist language, microphone approval, background media, reporting retention, and optional AI Tutor can vary without hard-coding MiniStar classroom assumptions.

## Cost Impact

Positive. A small TypeScript contract is cheaper than reworking teacher screens after choosing persistence. It also prevents premature backend lock-in by naming the fields that need durability before selecting a database or packaged local storage path.

## Constraints

- Audio support remains required for learner-facing text.
- Assist language cannot unlock games, award mastery, or satisfy completion.
- Microphone approval must become persisted before classroom use.
- Raw audio and transcripts are not stored in the scaffold.
- AI Tutor is optional premium/enterprise, not a core dependency.
- Demo-only persistence warnings are not safety failures.

## Verification

Use `docs/verification/TEACHER_SESSION_MONITOR_CHECKS.md` and confirm both teacher monitor routes display safety status, persistence warnings, and tenant-appropriate settings.

## Related Files

- `packages/content-model/src/sessionSettings.ts`
- `docs/TEACHER_SESSION_SETTINGS_CONTRACT.md`
- `docs/adr/0026-teacher-session-settings-contract.md`
