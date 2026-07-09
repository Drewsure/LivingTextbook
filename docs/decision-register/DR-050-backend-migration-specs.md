# DR-050: Backend Migration Specs Before Vendor Migrations

Date: 2026-07-09

Status: accepted

## Decision

Add a backend migration specification layer before writing backend-specific migrations.

The first specs cover:

- Tenant entitlements.
- Package releases.
- Permanent QR aliases.
- Progress events.

## Rationale

The platform must stay white-label and deployment-flexible. Moving directly from schema draft to Supabase, Firebase, or local database migrations would risk letting vendor details shape the product model too early.

The migration specs define the durable product records first, including primary keys, tenant scope, indexes, retention, export, local fallback, and policy blockers.

## Consequences

- Backend work has a clearer contract.
- Progress-event storage remains blocked until student privacy/reporting policy is accepted.
- Hosted and local deployment plans can use the same vocabulary.
- The project still has not chosen a production backend.
