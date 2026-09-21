# ADR 0920: Report Snapshot Recovery Review Surface

## Status

Accepted for foundation review; recovery remains non-executing.

## Decision

Show the provider-neutral report snapshot recovery rehearsal on the teacher
persistence workbench and the tenant-aware report-package preview. Both
surfaces use the same resolved snapshot and display hosted-managed and
closed-local packet validation side by side.

## Rationale

The contract is easier to govern when teachers and implementation reviewers
can see the same evidence where persistence decisions are made. A shared
surface also prevents the hosted and local product variants from drifting into
different report formats. The panel is evidence only: it does not expose raw
events or add a backup, restore, export, or provider activation control.

## Required Invariants

- Snapshot identity is resolved from the tenant-aware monitor context.
- Hosted-managed and local-classroom rehearsals use the shared snapshot shape.
- A valid rehearsal is visibly distinct from permission to execute recovery.
- Provider activation, export, writes, and real learner identifiers remain
  blocked.

## Evidence

- `apps/web/src/features/persistence/TeacherReportSnapshotRecoveryRehearsalPanel.tsx`
- `apps/web/src/app/teacher/persistence/page.tsx`
- `apps/web/src/app/teacher/sessions/[launchCode]/report-package/page.tsx`
- `scripts/verify-report-runtime.mjs`

