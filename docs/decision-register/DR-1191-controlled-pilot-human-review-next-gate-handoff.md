# DR-1191: Controlled-Pilot Human-Review Next-Gate Handoff

## Decision

Carry a validated controlled-pilot human-review adjudication into a separate
review-only next-gate handoff record.

## Rules

- Preserve exact tenant, package, packet, readiness, decision snapshot,
  release-review, and adjudication identity.
- Derive only `blocked` or `ready-for-next-gate`.
- Require a recipient adult review role and list required next records.
- Keep approval capture, persistence write, release mutation, promotion, local
  activation, and student production launch false.
- Revalidate the source adjudication before any future approval-design work.

## Evidence

The release-control route exposes the handoff panel and
`scripts/verify-controlled-pilot-human-review-next-gate-handoff.mjs` verifies
the lineage and operational boundaries.
