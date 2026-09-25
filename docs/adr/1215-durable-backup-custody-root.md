# ADR 1215: Durable Backup Custody Root

**Status:** Accepted  
**Date:** 2026-09-25

## Context

Server-side SQLite backup and restore operations are policy-gated and now use
validated manifests. A caller-provided filesystem path is still too broad for
a production deployment: an operational mistake could place learner
progression artifacts outside the reviewed backup custody boundary.

## Decision

Durable backup and restore operations require
`LIVING_TEXTBOOK_PERSISTENCE_BACKUP_ROOT`. Every backup source and destination
must resolve below that root and cannot be the root itself. The path policy is
server-only and fails closed when the root is absent or the artifact escapes
the root. This does not enable backup execution, encryption, cloud custody, or
restore activation; those remain separately gated deployment responsibilities.

## Consequences

- Backup artifacts have an explicit deployment custody boundary.
- Relative paths, nested backup folders, and platform-specific separators are
  resolved consistently before the SQLite adapter is called.
- A deliberate pilot must document the root's encryption, permissions,
  retention, external-copy, and restore procedures before enabling operations.

## Verification

`npm run verify:durable-operations` covers valid nested paths, missing roots,
root paths, outside paths, and traversal attempts.
