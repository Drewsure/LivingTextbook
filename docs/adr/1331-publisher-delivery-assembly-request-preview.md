# ADR 1331: Publisher Delivery Assembly Request Preview

## Decision

Expose a tenant-bound, review-only preview of the exact inputs required by the
closed-local package writer. The preview is derived from the live quarantine
handoff and is displayed beside the delivery closure packet.

The preview must remain blocked and side-effect-free. It does not accept a
writer request, copy files, create a QR print artifact, activate persistence,
or start students.

## Required input lanes

The preview names the approved delivery manifest, manual release receipt, QR
registry, delivery package index, offline bundle manifest, immutable review
packet binding, and authorized operator/write timestamp.

## Rationale

The closure packet establishes whether the release is complete; this preview
establishes what the eventual local package handoff must contain. Keeping the
two records separate prevents a readiness summary from being mistaken for a
package-writer command while giving the future operator a concrete, auditable
handoff shape.

## Consequences

- The live publisher workflow can identify missing writer inputs before a real
  package assembly request is attempted.
- The local writer remains behind its existing authenticated release and
  custody gates.
- A future approved assembly UI can consume this contract without inferring
  requirements from implementation details.

## Verification

`npm run verify:publisher-delivery-assembly-request-preview` validates seven
writer inputs, identity binding, blocked actions, and read-only UI markers.
