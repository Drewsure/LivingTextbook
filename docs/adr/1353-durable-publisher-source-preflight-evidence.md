# ADR 1353: Durable Publisher Source Preflight Evidence

Date: 2026-10-01
Status: Accepted

## Decision

Attach a complete, validated publisher source preflight report to the
tenant-scoped quarantine record as an immutable metadata sidecar when the
verified textbook-source checksum exactly matches the quarantined intake
checksum. The write gate is explicit and disabled by default.

## Rationale

The saleable pilot needs a durable chain from publisher source folder to
reviewed package evidence. A local report by itself is not enough, and copying
the publisher payload into a second location would expand custody and privacy
risk. A small sidecar preserves the report identity and aggregate fingerprints
without duplicating source bytes.

## Boundaries

The sidecar is review-only, metadata-only, immutable, idempotent, and
tenant/quarantine bound. It never authorizes package assembly, promotion, QR
printing, hosted persistence activation, student-facing use, or learner data.
