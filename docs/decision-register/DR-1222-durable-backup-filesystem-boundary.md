# DR-1222: Durable Backup Filesystem Boundary

Date: 2026-09-28  
Status: Accepted

Backup and restore operations now use realpath-aware custody validation in
addition to lexical validation. Missing roots, non-directory roots, and
junction or symlink escapes fail closed before SQLite artifacts are created or
copied. The existing policy, manifest, encryption, rotation, retention, and
approval gates remain required.

Evidence: `apps/web/src/server/persistence/backupPathPolicy.ts`,
`apps/web/src/server/persistence/sqliteProgressionOperations.ts`, and
`scripts/verify-durable-progression-backup-path.mjs`.
