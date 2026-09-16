# DR-886: Authenticated student session boundary

## Decision

The first durable browser write path uses a server-validated coded front door
and a signed, expiring HttpOnly cookie. The cookie is bound to tenant,
package, launch, and coded student-session identity. The persistence API token
remains server-only.

## Evidence

The temporary SQLite smoke test authenticated a valid sample launch, accepted a
durable browser-session write, preserved `durable-managed` on the stored record,
and returned the record through an authorized read. Invalid and cross-tenant
identities remain fail-closed.
