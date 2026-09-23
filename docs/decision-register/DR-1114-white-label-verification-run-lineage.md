# DR-1114: White-Label Verification Run Lineage

## Decision

Release-readiness quality evidence must be bound to a named verification run
and revision. The values are visible review metadata, not an approval token.

## Required invariants

- `verificationRunId` is non-empty.
- `verificationRevision` is non-empty.
- Missing lineage is rejected even when all seven quality booleans are true.
- Refreshing the evidence source requires refreshing the packet lineage.
- No lineage value enables release, persistence, export, installation, provider
  activation, QR mutation, or student launch.

## Status

Implemented and verified as review-only evidence.
