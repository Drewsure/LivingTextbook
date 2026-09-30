# ADR 1334: Live Source-to-Package Evidence Binding

## Status

Accepted for foundation hardening. Read-only review route.

## Decision

Expose the source-to-package evidence bridge through a tenant-authorized GET
route for every quarantined publisher submission. The route derives bounded
identities from the quarantine record and any existing source review decision,
then returns the same eight evidence lanes used by the MiniStar reference
review.

The route returns metadata only. It does not read or return payload bytes,
create extraction records, approve sentences, attach audio, write evidence,
assemble packages, print QR codes, activate persistence, or enable students.

## Consequences

- A real publisher submission has one consistent evidence view, not a sample-
  only contract.
- Missing extraction, sentence, audio, rights, game, and release evidence is
  visible before the package-review workflow is attempted.
- Authorization, tenant boundaries, and no-write behavior are testable at the
  live API boundary.
