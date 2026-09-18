# ADR 0867: Local Recovery Evidence Reconciliation

## Status

Accepted for foundation rehearsal.

## Context

Provider approval and recovery packets are separate evidence artifacts. If a
future adapter reads them independently, tenant or package identity drift can
be missed, and an open evidence lane can be mistaken for approval.

## Decision

Use `reconcileLocalBundleRecoveryEvidence` as the shared comparison seam. It
validates both packets, requires exact tenant/bundle/package identity, reports
open checks and lanes, classifies the result as aligned, needs-evidence, or
mismatch, and always returns `executionAllowed: false` with
`sideEffect: "none"`.

## Consequences

The platform can show a precise, teacher-readable explanation of what remains
before provider selection without adding a second storage implementation. A
matching packet still cannot create backups, restore or export data, delete by
retention policy, write a package, promote a student, or mutate routes.
