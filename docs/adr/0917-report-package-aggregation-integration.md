# ADR 0917: Report Package Aggregation Integration

## Decision

Use the authorized launch-scoped teacher report aggregation inside the report
package preview route as a live review surface. Keep the existing static
report-package rehearsal alongside it so the preview continues to show both the
planned package shape and the current bounded persistence evidence.

## Required invariants

- The route derives tenant, content package, and launch scope from the resolved
  server-side monitor context.
- The hosted review panel remains read-only and protected by the existing
  teacher operations authorization handoff.
- Export, persistence mutation, live classroom launch, roster promotion, and
  broad student discovery remain blocked.
- The route must preserve protected, blocked, unavailable, and empty states.
- No raw learner audio, transcript, or real learner identifier may enter the
  rendered report preview.

## Consequences

Teacher and publisher reviewers can compare the planned report package with the
actual bounded evidence path before any production export adapter is enabled.
This gives the pilot a stronger acceptance surface without prematurely making
the report package a live data product.

## Evidence

- `apps/web/src/app/teacher/sessions/[launchCode]/report-package/page.tsx`
- `apps/web/src/features/persistence/HostedProgressEventReviewPanel.tsx`
- `docs/adr/0916-teacher-launch-report-aggregation.md`
- `scripts/verify-teacher-launch-report-aggregation.mjs`
