# ADR 1216: Durable Database Custody Root

**Status:** Accepted  
**Date:** 2026-09-25

## Context

Durable backup and restore artifacts now have an explicit custody root, but a
SQLite progression database could still be pointed at an unrelated filesystem
location. That makes a deployment look durable while leaving its primary
learner-data store outside the reviewed data boundary.

## Decision

When the SQLite provider is selected, the deployment gate requires
`LIVING_TEXTBOOK_PERSISTENCE_DATA_ROOT` and validates the effective
`LIVING_TEXTBOOK_PROGRESSION_DB_PATH` beneath that root. The database must be a
nested `.sqlite` file, not the root itself. The check is metadata-only and does
not expose the path through the status API.

Process-memory rehearsal remains unchanged. This decision does not enable
durable writes, encryption, cloud hosting, migration, or activation.

## Consequences

- Primary durable learner data and backup artifacts have separate, explicit
  custody boundaries.
- A missing root, root-level path, outside path, traversal path, or non-SQLite
  extension blocks durable readiness.
- A deliberate deployment must document filesystem permissions, encryption at
  rest, secret rotation, retention, and restore procedures for both roots.

## Verification

`node scripts/verify-durable-progression-database-path.mjs` covers valid nested
database paths, extension enforcement, missing roots, root paths, outside
paths, and traversal attempts.
