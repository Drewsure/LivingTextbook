# DR-1015: Shared Quarantine Package Identity

Status: Accepted

Decision: Review-only upload APIs must use one deterministic helper for
default package identity derivation.

Rationale:

- Source, evidence, package, delivery, and release lineage must share one
  package scope.
- A centralized helper prevents route-specific identity drift.
- Explicit package overrides remain available for reviewed package naming.

Consequences:

- Future routes must import the shared helper.
- Identity consistency is now part of upload quarantine verification.
- This does not change any release or student activation permission.
