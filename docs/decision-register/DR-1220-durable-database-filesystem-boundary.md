# DR-1220: Durable Database Filesystem Boundary

Date: 2026-09-25  
Status: Accepted

Durable SQLite readiness now checks real filesystem containment in addition to
normalized path containment. Existing roots, ancestors, and database files
must not resolve through a symlink or junction outside the configured data
custody root. The root must exist before readiness is reported; no learner data
is opened or moved by the policy check.

Evidence: `apps/web/src/server/persistence/databasePathPolicy.ts`,
`scripts/verify-durable-progression-database-path.mjs`, and ADR 1220.
