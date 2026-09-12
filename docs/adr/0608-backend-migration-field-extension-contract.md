# ADR-0608: Backend Migration Field Extension Contract

Status: Accepted

## Decision

The vendor-neutral backend schema draft may declare explicit
`migrationFieldExtensions` for materialized fields used by migration specs
but not yet represented in the conceptual entity field list. Every extension
must name an existing schema entity and carry the same field shape, required
flag, and explanatory note as a normal schema field.

Migration specs may use only fields declared by their target schema entity or
that entity's explicit migration extensions. Unknown fields are rejected
before a backend adapter or migration implementation can be considered.

## Why

The first cross-definition audit found real drift in release ids, revision
fields, event payloads, QR alias payloads, media metadata, and school policy
record revisions. Silently accepting those fields would make hosted and local
implementations disagree about the stored contract.

## Guardrails

- Extensions are schema metadata, not permission to write live data.
- They do not enable a backend vendor, object storage, file upload, or local
  folder write.
- Raw learner audio, learner transcripts, and raw source files remain blocked
  from the core schema.
- Migration-only fields remain visible in the teacher persistence review
  surface for human review.

## Consequences

The backend contract can represent deliberate materialized storage fields
without bloating the conceptual entity descriptions, while field drift now
fails deterministically before integration work begins.
