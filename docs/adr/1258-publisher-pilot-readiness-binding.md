# ADR 1258: Publisher Pilot Readiness Binding

## Status

Accepted for the foundation and pilot handoff work.

## Decision

The first saleable white-label pilot uses one metadata-only publisher package
readiness binding to join the complete review lineage: quarantined source,
package review packet, assembly preflight, package preview, readiness
reconciliation, delivery manifest, release receipt, package index, and hosted
persistence opt-in packet.

The binding is a review surface, not a package writer. It must remain blocked
until the required checks pass, and it must always keep package assembly,
promotion, and student-facing use disabled. The closed-local delivery path
remains available when hosted persistence is not selected.

## Rationale

The preview and delivery panels previously exposed valid but separate pieces of
the publisher handoff. A publisher needs one durable answer to “what is ready,
what is blocked, and what must happen next?” without the platform implying that
assembly or hosted activation has occurred.

## Consequences

- The handoff route can show a complete, auditable package status.
- Source checksums and package identities can be reconciled across layers.
- Real package writes, QR printing, promotion, credentials, and learner records
  remain behind their existing human gates.
- A future package writer can consume the binding as a precondition without
  re-creating identity rules in UI code.
