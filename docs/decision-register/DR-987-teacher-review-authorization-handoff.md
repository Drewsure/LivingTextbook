# DR-987: Teacher Review Authorization Handoff

## Decision

Expose the existing tenant-scoped teacher operations session on the launch
monitor and reuse its session-change event to refresh bounded event review.

## Rationale

Teachers should encounter the authorization boundary at the point where they
review a class launch, not only on a separate persistence workbench. Reusing
the established cookie and event avoids divergent access behavior.

## Required Invariants

- No second login path or client-held token is introduced.
- Tenant scope must match the launch.
- Review remains read-only and metadata-only.
- Sign-out removes access and refreshes the dependent review panel.

## Evidence

- ADR 0915
- `apps/web/src/app/teacher/sessions/[launchCode]/page.tsx`
- `apps/web/src/features/persistence/TeacherOperationsAccessPanel.tsx`
