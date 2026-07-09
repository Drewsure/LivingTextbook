# ADR 0048: Vendor-Neutral Backend Schema Draft

Date: 2026-07-09

## Status

Accepted

## Context

The platform has enough persistence planning to begin comparing real backend options, but choosing a vendor before naming the schema would risk bending the product around that vendor.

The first pilot needs tenant boundaries, package releases, QR aliases, media manifests, launch sessions, progress events, publish gates, and approval ledgers. These must remain understandable whether implemented in hosted relational storage, hosted document storage, local SQLite-style storage, or a hybrid approach.

## Decision

Add a vendor-neutral backend schema draft as data and an admin panel on `/teacher/intake`.

The draft lists entities, fields, relationships, indexes, forbidden fields, migration notes, and cross-cutting rules.

## Consequences

Positive:

- Backend candidates can be compared against the same schema expectations.
- Release control and approval ledgers stay first-class.
- Raw learner audio/transcript exclusions remain visible.
- Hosted and local paths share the same vocabulary.

Tradeoffs:

- The schema draft adds another admin foundation panel.
- Actual migrations remain deferred until backend choice and policy review are complete.

## Verification

Use `docs/verification/BACKEND_SCHEMA_DRAFT_CHECKS.md` after pulling connector-side commits.
