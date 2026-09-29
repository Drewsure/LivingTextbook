# ADR 1282: Package Review Packet Revisions Are Immutable Sidecars

Date: 2026-09-30
Status: Accepted

## Decision

When a package review packet is blocked because a later prerequisite has been
recorded, the system may create a new immutable revision rather than mutating
the original record. Revision one preserves the existing
`package-review-packet.json` identity. Later revisions use deterministic
`package-review-packet-vN.json` sidecars and identify the packet they supersede.

The reader selects the highest valid revision after validating every candidate's
tenant and quarantine binding. A ready packet is never replaced by a later
automatic revision, and a blocked packet is only reissued when the promotion
adapter sidecar closes the specific missing lineage prerequisite.

## Boundary

Revisioning changes review metadata lineage only. It does not authorize package
assembly, promotion, QR printing, hosted persistence, or student-facing use.

## Consequences

- A publisher review can progress after recording a missing adapter decision.
- Earlier reviewer evidence remains auditable and immutable.
- Release lineage always sees the highest valid packet revision.
- The frozen Z.ai/Phaser source remains outside package promotion until its
  separate evidence and adjudication gates pass.
