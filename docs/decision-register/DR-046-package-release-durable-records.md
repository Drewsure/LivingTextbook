# DR-046: Package Release Durable Records

Date: 2026-07-09

## Status

Accepted

## Decision

Add package publish gates and package approval ledgers to the shared durable persistence record contract before choosing a backend vendor.

## Rationale

The platform now has a package publish gate and approval ledger in the teacher/admin intake scaffold. Those cannot remain loose sample-only concepts if the product is to support real white-label pilots and yearly publisher maintenance. The records need to be part of the persistence map before Supabase, Firebase, SQLite, Postgres, local-first storage, or another option is selected.

## White-Label Impact

Positive. MiniStar, schools, and publisher tenants can use the same release-control record shape while naming their own owners, evidence, media-rights procedures, and approval policies.

## Cost Impact

Positive. Defining the record shape now avoids premature vendor lock-in and reduces later migration cost. It also keeps the first pilot honest by naming release gates and approval ledger requirements before production storage is built.

## Constraints

- Package publish gates must not mark a package pilot-publishable while release-blocking items remain open.
- Package approval ledgers require approver identity, timestamp, evidence, and policy rules before real signatures are stored.
- No raw learner audio or transcripts are stored in these core records.
- Media-rights references require object-storage or local-bundle decisions.
- Local/closed deployment capable records must preserve a local classroom store path.

## Verification

Use `docs/verification/PERSISTENCE_BOUNDARY_CHECKS.md` after pulling connector-side commits.
