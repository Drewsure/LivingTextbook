# ADR 0843: Evidence-Only Package Approval Linkage

## Decision

Promote the package approval ledger into the shared content model and require
review-only source-package assembly packets to reference it.

## Rationale

The platform already displayed an approval ledger, but its shape lived inside
the web sample data. That made the most important release boundary easy to
drift from other tenants, local bundles, or future persistence adapters. The
shared contract makes responsibilities and safety guards portable without
pretending that a preview is a real approval record.

## Guardrails

- All seven approval responsibilities must be represented.
- The ledger remains `review-only` and `evidence-only`.
- Approval capture and package promotion are literal false guards.
- Assembly packets must link a ledger identifier before they are valid.

## Excluded

Reviewer authentication, signed approval storage, package promotion, route or
QR mutation, assignment, and student-facing activation.

See `docs/verification/EVIDENCE_ONLY_PACKAGE_APPROVAL_CHECKS.md`.
