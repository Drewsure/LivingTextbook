# DR-1217: Durable Encryption-at-Rest Policy Gate

Date: 2026-09-25  
Status: Accepted

Durable SQLite operations and deployment readiness now require the explicit
server-side `LIVING_TEXTBOOK_PERSISTENCE_ENCRYPTION_AT_REST_ACCEPTED` policy
flag. The flag is false by default and is not an encryption implementation;
it records that a deployment owner has separately documented encryption,
key-management, rotation, access, and backup-protection controls. Process-memory
rehearsal remains available and external Phaser source remains isolated.

Evidence: `apps/web/src/server/persistence/sqliteProgressionOperations.ts`,
`.env.example`, ADR 1217, and the durable persistence verification scripts.
