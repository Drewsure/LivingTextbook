# DR-1009: Tenant-Scoped Evidence Handoff Empty State

Date: 2026-09-30  
Status: Accepted

## Decision

Safe white-label tenants may open the evidence handoff route before a package
review packet exists. The route shows no static package evidence for those
tenants, while a supplied quarantine identity may use the tenant-bound review
bridge.

## Safety boundary

This is a routing and display decision. It does not export evidence, sign a
packet, assemble a package, publish QR aliases, create playlists, assign
students, or activate student routes.

## Rationale

A publisher's real review handoff must be able to begin from its own quarantine
record. Keeping static package panels tenant-owned makes that path useful while
preserving honest readiness and tenant isolation.

See ADR 1293.
