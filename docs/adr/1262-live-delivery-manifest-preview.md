# ADR 1262: Live Delivery Manifest Preview

Date: 2026-09-29
Status: Accepted

## Decision

The live publisher handoff now derives a metadata-only delivery-manifest
preview from the actual tenant-scoped quarantine submission, evidence review,
and package review packet. The preview carries future manifest, release
receipt, and package-index identities plus the source checksum and a bounded
set of delivery checks.

The preview is permanently blocked and review-only. It is not a delivery
manifest, does not select hosted or local persistence, and cannot authorize
assembly, QR printing, release, or student use.

## Consequences

- The live handoff no longer stops at a generic “no delivery manifest linked”
  message; it shows the exact missing delivery decisions for that submission.
- Sample package data cannot be mistaken for a real publisher submission.
- The next human action is explicit: choose delivery mode, attach the reviewed
  package evidence, complete release/rollback review, and authorize QR print.
- The closed-local path remains visible as an option without enabling hosted
  credentials or learner writes.
