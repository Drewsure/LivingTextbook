# ADR 0050: Backend Migration Specs Before Vendor Migrations

Date: 2026-07-09

Status: accepted

## Context

The project has a backend decision matrix, schema draft, and migration candidate list. The next architectural risk is implementing backend-specific migrations too soon.

## Decision

Introduce vendor-neutral backend migration specs on `/teacher/intake`.

These specs define:

- Store purpose.
- Primary key.
- Tenant scope.
- Fields.
- Indexes.
- Retention rule.
- Export rule.
- Local fallback.
- Policy blockers.

## Implications

Production migrations remain deferred.

The first real backend implementation must map to these specs instead of inventing new names or records.

Student progress events are intentionally policy-blocked until identity, retention, consent, and reporting rules are settled.
