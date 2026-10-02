# ADR 1435: Durable Publisher Revision Evidence

## Status

Accepted for the first saleable white-label pilot.

## Decision

Every versioned publisher handoff revision creates one immutable
`evidence/publisher-handoff-revision.json` record. It binds the source and
copied brief checksums, copied paths, missing required paths, omitted optional
paths, excluded stale artifacts, and review-only safety flags. The record is
metadata-only and is created with no-overwrite semantics.

## Consequences

An operator can prove what was carried into a revision before running fresh
intake and source preflight reports. The record does not approve rights,
accessibility, package assembly, QR printing, persistence, or student use.
