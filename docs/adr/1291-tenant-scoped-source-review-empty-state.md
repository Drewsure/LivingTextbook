# ADR 1291: Tenant-Scoped Source Review Empty State

Date: 2026-09-30  
Status: Accepted

## Context

Publisher intake now has a tenant-aware upload and evidence shell, but source
review was still restricted to the two known demo tenants. A new publisher
would be stopped between upload intake and extraction review.

## Decision

Resolve the source review route through the shared tenant resolver and filter
all source queues, extraction packets, and previews by the requested tenant.
When no records exist, render an explicit empty state linking to that tenant's
upload workspace. Never substitute another tenant's source records.

## Consequences

- The white-label publisher path now has upload, source review, and evidence
  review entry points.
- New publishers see a useful blocked state instead of fabricated readiness.
- Existing MiniStar and Sample Publisher source records retain their current
  review behavior.
- Extraction, OCR, parser, AI import, draft creation, release, assignment,
  and student use remain independently blocked.

See DR-1007.
