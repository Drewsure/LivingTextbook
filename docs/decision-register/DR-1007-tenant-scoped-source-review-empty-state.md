# DR-1007: Tenant-Scoped Source Review Empty State

Date: 2026-09-30  
Status: Accepted

## Decision

Safe white-label tenants may open the source review workspace before any
source has been admitted. The workspace shows zero source records and links to
tenant upload intake; it never displays MiniStar or Sample Publisher records.

## Safety boundary

This is a read-only routing and filtering decision. It does not perform OCR,
extract content, create drafts, write storage, publish routes, create games,
create playlists, assign students, or activate progression.

## Rationale

A publisher must be able to follow a coherent intake journey without the
platform pretending that a source package has already arrived. An explicit
empty state preserves that distinction while keeping the white-label path
usable.

See ADR 1291.
