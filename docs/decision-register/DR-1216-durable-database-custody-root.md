# DR-1216: Durable Database Custody Root

Date: 2026-09-25  
Status: Accepted

SQLite durable persistence must remain below the configured
`LIVING_TEXTBOOK_PERSISTENCE_DATA_ROOT`, using a nested `.sqlite` file. The
deployment gate withholds durable readiness when the root is missing or the
effective database path is outside the root. The status surface does not return
filesystem paths. This protects the saleable white-label deployment boundary
without enabling persistence activation or claiming encryption-at-rest.

Evidence: `apps/web/src/server/persistence/databasePathPolicy.ts`,
`apps/web/src/server/persistence/persistenceDeploymentGate.ts`,
`scripts/verify-durable-progression-database-path.mjs`, and ADR 1216.
