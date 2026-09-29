# ADR 1269: Live Review Decision Binding

## Status

Accepted.

## Decision

Bind the existing immutable quarantine review-decision sidecar into the live
package-readiness response and teacher handoff panel as read-only evidence.

## Rationale

The publisher needs to see whether the submitted source has reached the
package-review checkpoint. Reusing the existing tenant-scoped record preserves
lineage and avoids a second decision store.

## Consequences

- The live handoff can distinguish no decision, accepted-for-package-review,
  and changes-required.
- Reviewer metadata and unresolved blockers are visible without exposing files.
- Release approval, package assembly, promotion, QR printing, hosted
  persistence, and student use remain separate blocked gates.
