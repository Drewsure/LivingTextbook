# DR-915: Evidence-Only Package Approval Linkage

## Decision

Require source-to-package assembly candidates to reference a validated,
tenant-scoped approval ledger while keeping approval capture and package
promotion disabled.

## Why

An approval panel without a shared contract can become presentation-only and
drift away from the package pipeline. The linkage makes the missing human
review evidence explicit without opening a live workflow.

## Verification

- Shared approval ledger validator.
- Required-role and review-only state checks.
- Source assembly linkage checks.
- Runtime behavior checks for false guard violations.
- Teacher intake and active-route checks.

## Not enabled

No signed approval capture, reviewer identity storage, durable writes, package
promotion, QR mutation, assignment, or student-facing activation.
