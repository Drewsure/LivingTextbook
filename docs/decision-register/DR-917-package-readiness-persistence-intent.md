# DR-917: Package Readiness Persistence Intent

## Decision

Create a tenant-scoped, provider-neutral persistence intent for the package
readiness reconciliation record before enabling a hosted or local adapter.

## Included

- Seven evidence-lane references.
- Hosted database and local classroom store previews.
- Explicit metadata-only state.
- Provider unselected, write blocked, promotion blocked, and student activation
  blocked guards.
- Teacher persistence workbench and runtime/route verification coverage.

## Excluded

Provider credentials, database or object-storage writes, local file writes,
uploads, exports, signed approvals, package publishing, route/playlist/
assignment writes, and student-facing activation.

See ADR 0845 and
`docs/verification/PACKAGE_READINESS_PERSISTENCE_CHECKS.md`.
