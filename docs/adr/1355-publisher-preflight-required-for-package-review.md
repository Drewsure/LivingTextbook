# ADR 1355: Publisher Preflight Required for Package Review

## Status

Accepted

## Context

The saleable white-label pilot accepts publisher textbook and multimedia
source through a quarantined, review-only workflow. The source-directory
preflight computes a manifest fingerprint, inventory fingerprint, and exact
file checksums. A durable metadata sidecar now preserves that evidence beside
the quarantine record.

The package review packet is the next operator checkpoint. Allowing it to be
recorded before the source preflight sidecar exists would create an apparently
complete review snapshot without a durable, checksum-bound account of the
publisher's submitted source inventory.

## Decision

Require the matching durable publisher source preflight evidence sidecar before
recording a package review packet. The API validates tenant, quarantine,
package, and source checksum continuity. An existing blocked packet may be
reissued only when the newly attached sidecar completes this lineage, and the
new revision records the sidecar identity.

The teacher-facing quarantine handoff must expose a visible `Preflight
lineage` status and keep the packet action disabled until the sidecar is
attached. Client guidance and server enforcement therefore describe the same
gate.

## Consequences

Positive:

- Package review packets have durable source provenance rather than an
  operator-only implication.
- A publisher can correct the sequence by attaching reviewed evidence and
  receiving a new immutable packet revision.
- White-label tenants receive the same auditable intake contract without
  exposing source payload bytes or filesystem paths.

Trade-offs:

- Reviewers must complete the preflight evidence step before packet capture.
- Existing blocked packets may show a reissue path rather than an immediate
  ready state.

## Protected boundaries

This decision does not authorize package assembly, asset promotion, QR
printing, hosted persistence, learner-record creation, or student-facing use.
The evidence sidecar and review packet remain metadata-only and review-only.

## Verification

- `node scripts/verify-upload-quarantine-package-review-packet.mjs`
- `npm run verify:publisher-intake-rehearsal`
- `npm run typecheck --workspace @living-textbook/web`
