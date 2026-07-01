# DR-030: Teacher Report Export Readiness

Status: Accepted  
Date: 2026-07-02

## Decision

Represent teacher report export as a shared readiness contract before building a live export button or choosing a backend.

## White-Label Impact

Strongly positive. Schools, academies, and textbook publishers can all receive teacher progress reports, but each tenant may need different export policy, retention, branding, deployment channel, and allowed report scope.

## Cost Impact

Positive. A small shared contract is cheaper than building export once for hosted web and rebuilding it later for local classroom servers or packaged apps.

## Constraints

- Core exports must require a teacher role.
- Core exports must require accepted school or tenant policy.
- Core exports must exclude raw learner audio.
- Core exports must exclude learner transcripts unless a future premium transcript policy is explicitly accepted.
- Export cannot be production-ready while launch sessions and progress events remain demo-local.
- Report scope and format must remain tenant-configurable.

## Verification

Use `docs/verification/TEACHER_REPORT_EXPORT_CHECKS.md` and verify:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`

## Related Files

- `packages/content-model/src/sessionSettings.ts`
- `apps/web/src/data/sampleTeacherSessionMonitor.ts`
- `apps/web/src/features/teacher/TeacherSessionMonitorPanel.tsx`
- `docs/adr/0029-teacher-report-export-readiness.md`
