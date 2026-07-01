# Build Session Note: Teacher Report Export Readiness

Date: 2026-07-02

## What Changed

Added a shared report-export readiness contract and surfaced it in the teacher session monitor.

Files touched:

- `packages/content-model/src/sessionSettings.ts`
- `apps/web/src/data/sampleTeacherSessionMonitor.ts`
- `apps/web/src/features/teacher/TeacherSessionMonitorPanel.tsx`
- `docs/TEACHER_SESSION_SETTINGS_CONTRACT.md`
- `docs/adr/0029-teacher-report-export-readiness.md`
- `docs/decision-register/DR-030-teacher-report-export-readiness.md`
- `docs/verification/TEACHER_REPORT_EXPORT_CHECKS.md`

## Product Reason

Teacher reports are a core white-label feature for schools and textbook partners, but export must not become an unsafe raw-data dump. The platform now shows what a future report may include while clearly blocking export until policy and persistence are accepted.

## Current State

The teacher monitor displays:

- report export readiness,
- allowed report formats,
- included report scopes,
- raw audio and transcript exclusions,
- export safety status,
- policy and persistence blockers.

Export remains non-mutating and scaffold-only.

## Verification

After pulling latest:

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`

Use `docs/verification/TEACHER_REPORT_EXPORT_CHECKS.md`.
