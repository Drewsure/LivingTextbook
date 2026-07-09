# DR-048: Vendor-Neutral Backend Schema Draft

Date: 2026-07-09

## Status

Accepted

## Decision

Add a vendor-neutral backend schema draft before selecting a backend provider.

## Rationale

The project now has durable record categories, adapter write intents, release gates, and approval ledgers. The next risk is choosing a backend before the storage shape is clear. A vendor-neutral schema draft lets Supabase, Firebase, SQLite, Postgres, local-first storage, or another option be compared against the same required entities.

## White-Label Impact

Positive. Tenant, package, QR, media, launch session, progress, publish gate, and approval ledger records are defined as platform concepts rather than vendor-specific implementation details.

## Cost Impact

Positive. Defining entities, fields, relationships, indexes, and forbidden fields first reduces migration and refactor risk later.

## Constraints

- No backend vendor is selected by this draft.
- No migration SQL is created yet.
- Raw learner audio and transcripts stay out of core schema.
- Package release control must be represented.
- Local and hosted implementations must preserve the same record vocabulary.

## Verification

Use `docs/verification/BACKEND_SCHEMA_DRAFT_CHECKS.md` after pulling connector-side commits.
