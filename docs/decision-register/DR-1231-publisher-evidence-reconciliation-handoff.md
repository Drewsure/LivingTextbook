# DR-1231: Publisher Evidence Reconciliation Handoff

## Decision

Bind the publisher package handoff to the tenant-filtered package-readiness
reconciliation already used by intake.

## Why

The first saleable pilot needs one auditable answer to whether textbook content,
games, audio, video, QR, assignment, and persistence evidence belong to the
same package. Separate preview cards can otherwise drift.

## Boundary

This is a review-only evidence join. It does not create storage, accept
approval, print production QR codes, promote content, or activate learner data
persistence.

## Next gate

Replace the sample publisher placeholders with real publisher source, rights,
checksum, scan, media, and policy records, then run release-control and
classroom dry-run verification against the same package identity.
