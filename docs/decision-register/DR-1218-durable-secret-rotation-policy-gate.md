# DR-1218: Durable Secret-Rotation Policy Gate

Date: 2026-09-25  
Status: Accepted

Durable persistence now requires the explicit server-only
`LIVING_TEXTBOOK_PERSISTENCE_SECRET_ROTATION_POLICY_ACCEPTED` gate. The flag is
false by default and records only that a deployment owner has documented
current/previous-secret overlap, revocation, expiry, incident response, and
tenant ownership. Existing session-cookie rotation support remains bounded and
unchanged; no live rotation or secret generation is enabled.

Evidence: `apps/web/src/server/persistence/sqliteProgressionOperations.ts`,
`.env.example`, ADR 1218, and the durable persistence verification scripts.
