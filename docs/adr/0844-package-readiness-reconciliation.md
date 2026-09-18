# ADR 0844: Package Readiness Reconciliation

## Decision

Introduce a shared reconciliation record that joins the evidence required to
move a tenant package toward release review, while keeping all promotion and
student-facing effects disabled.

## Rationale

The platform had strong individual gates, but they were difficult to inspect
as one identity chain. A reconciliation record provides a single answer for
which evidence is ready, which is unresolved, and why the package remains
blocked.

## Guardrails

- Seven evidence lanes are mandatory and tenant-scoped.
- The status is review-only or blocked.
- Target-language activity alone can drive progression.
- Promotion and student-facing activation are literal false guards.

## Excluded

Package persistence, release-state mutation, QR changes, assignments, and
student-facing activation.

See `docs/verification/PACKAGE_READINESS_RECONCILIATION_CHECKS.md`.
