# DR-1224: SQLite Constructor Custody Enforcement

Date: 2026-09-29  
Status: Accepted

The SQLite progression store now enforces the realpath-aware data custody
policy inside its constructor before opening or creating a database. Direct
server-side callers cannot bypass the deployment gate with an unsafe path.

Evidence: `apps/web/src/server/persistence/sqliteProgressionStore.ts` and
`scripts/verify-persistence-provider-conformance.mjs`.
