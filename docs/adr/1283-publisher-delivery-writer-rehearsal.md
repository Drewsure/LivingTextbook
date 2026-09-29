# ADR 1283: Rehearse Delivery Writer Boundaries Before Release

## Decision

The publisher intake rehearsal must continue past review-packet readiness and
exercise the delivery release and metadata writer endpoints while their
explicit write gates are disabled.

The rehearsal must prove that a complete review-only handoff cannot create a
release receipt, delivery metadata, QR print authorization, package assembly,
or student activation by implication.

## Rationale

The saleable pilot needs a real publisher path, but review evidence is not a
release. Testing only the preview route could allow a later API change to
cross the writer boundary without failing the rehearsal. Endpoint-level
negative evidence makes the boundary executable and keeps human release,
rollback, and school-policy decisions separate from package review.

## Consequences

- `scripts/verify-publisher-intake-rehearsal.mjs` now attempts release and
  metadata writes after the adapter-bound packet revision is ready.
- The attempts must return the explicit blocked state and must not report a
  receipt or metadata write.
- No production writer gate is enabled by this ADR.
- A human release receipt, QR authorization, rollback reference, and selected
  delivery policy are still required before any real pilot package can ship.
