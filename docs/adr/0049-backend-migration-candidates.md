# ADR 0049: Backend Migration Candidates

Date: 2026-07-09

## Status

Accepted

## Context

The platform now has a backend decision matrix, vendor-neutral schema draft, durable record map, and adapter write intents. It still should not jump directly into Supabase/Firebase/SQLite/Postgres migrations because policy, deployment, export, release control, and local compatibility gates remain open.

## Decision

Add a backend migration candidate plan as sample data and an admin panel on `/teacher/intake`.

The plan sequences migration slices from low-risk administrative records through policy-heavy event/report storage and later local classroom export/restore.

## Consequences

Positive:

- Backend implementation can proceed in safer slices later.
- Policy-heavy student-data storage stays behind explicit gates.
- Release-control records remain part of first-pilot planning.
- Local/closed deployment remains visible but deferred.

Tradeoffs:

- More admin scaffolding before production code.
- Production migrations are still intentionally deferred.

## Verification

Use `docs/verification/BACKEND_MIGRATION_CANDIDATES_CHECKS.md` after pulling connector-side commits.
