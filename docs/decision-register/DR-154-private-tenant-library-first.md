# DR-154: Private Tenant Library First

## Decision

Build private tenant library planning before public community sharing.

## Rationale

A public library could help teachers, but it introduces substantial governance risk. Private tenant libraries give the product a saleable, white-label resource reuse path without requiring moderation, public copyright review, or cross-tenant exposure in v1.

## Accepted Direction

- Add private tenant library planning data.
- Show library stages on `/teacher/intake`.
- Add `npm run verify:tenant-library`.
- Keep public community library blocked for v1.

## Follow-Up

Define durable ownership, copy/edit lineage, package versioning, and tenant visibility records after auth and persistence are selected.
