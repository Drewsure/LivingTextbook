# DR-045: Package Approval Ledger

Date: 2026-07-09

## Status

Accepted

## Decision

Add a backend-agnostic package approval ledger to the teacher/admin intake scaffold. The ledger names the required human sign-offs for a package release candidate before it can move from demo-ready to pilot-publishable.

## Rationale

The package publish gate identifies release blockers. The project also needs an accountability layer that names who owns sign-off for content, media rights, game QA, QR stability, privacy/report policy, deployment/support, and platform release review.

## White-Label Impact

Positive. A publisher, school, or MiniStar tenant can use the same approval shape while assigning different owners. This supports saleable yearly maintenance without forking schema or workflow per partner.

## Cost Impact

Positive. The first implementation is a sample-data scaffold and avoids backend commitment. It prepares the eventual persistence shape before auth, signatures, or audit trails are built.

## Constraints

- The ledger records approval intent only until persistence, authentication, and policy are accepted.
- A signed item cannot override safety, media-rights, report-policy, or persistence blockers.
- Optional premium features require explicit sign-off before activation.
- The ledger remains tenant-neutral and does not hard-code MiniStar-only fields.

## Verification

Use `docs/verification/PACKAGE_APPROVAL_LEDGER_CHECKS.md` after pulling connector-side commits.
