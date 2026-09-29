# ADR 1290: Tenant-Scoped Evidence Review Empty State

Date: 2026-09-30  
Status: Accepted

## Context

The upload review workspace now accepts a safe white-label tenant shell, but
the evidence packet route still rejected every tenant except the sample
publisher. Removing that guard without changing the data boundary would leak
sample evidence into a new publisher's review view.

## Decision

Resolve the evidence route through the shared tenant resolver. The populated
evidence index, assembly gate, and reviewer identity gate are rendered only
when the tenant owns the corresponding sample evidence records. Other safe
tenants receive an explicit empty, blocked evidence state linking back to the
tenant upload workspace.

## Consequences

- A future publisher can enter the evidence workflow without seeing another
  tenant's records.
- The review shell communicates the next controlled action before a packet
  exists.
- The route remains useful for white-label onboarding while avoiding false
  readiness or fabricated evidence.
- Evidence storage, export, approval, package assembly, QR promotion,
  assignments, and student use remain independently blocked.

See DR-1006.
