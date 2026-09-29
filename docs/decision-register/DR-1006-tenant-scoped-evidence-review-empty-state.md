# DR-1006: Tenant-Scoped Evidence Review Empty State

Date: 2026-09-30  
Status: Accepted

## Decision

Unprovisioned but safe publisher tenants receive a branded evidence review
shell with no evidence sources. Only the tenant that owns the sample package
can see the sample evidence index and its downstream review gates.

## Safety boundary

This is a routing and data-display decision only. It does not create evidence,
store attachments, assemble a package, approve a release, print QR codes, or
activate student routes.

## Rationale

White-label onboarding needs a coherent path from upload review to evidence
review. A tenant-aware empty state provides that path without making a new
publisher appear ready or exposing another tenant's sample records.

See ADR 1290.
