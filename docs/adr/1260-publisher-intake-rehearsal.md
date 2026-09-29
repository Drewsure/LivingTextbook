# ADR 1260: Publisher Intake Rehearsal

## Status

Accepted for the first saleable white-label pilot.

## Decision

Maintain a deterministic rehearsal that submits a synthetic textbook source
through the real controlled intake route, follows the tenant-scoped handoff,
reads the live readiness binding, records a review-only packet, and verifies
that the package remains blocked without a human decision.

The rehearsal uses an ephemeral custody root, an explicit upload-review token,
and a production-shaped web server. It must never use real publisher files,
learner data, a persistent custody directory, or a promotion credential.

## Authorization boundary

The live readiness binding accepts either the existing teacher-operations read
authorization or the configured upload-quarantine review token. The token is
limited to metadata review endpoints and does not authorize package assembly,
QR printing, hosted persistence, or student use.

## Acceptance evidence

- Intake returns an opaque quarantine identity and no learner-facing write.
- Handoff preserves tenant, package, quarantine, and source-checksum lineage.
- Readiness remains blocked before and after a review-only packet without a
  human decision.
- API responses do not expose source payload bytes, filesystem paths,
  credentials, or activation flags.

## Consequence

The publisher pilot can be rehearsed before a real publisher is onboarded,
while the ordinary foundation gate remains independent of a running server.
