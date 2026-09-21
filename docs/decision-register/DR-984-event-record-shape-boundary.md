# DR-984: Event Record Shape Boundary

## Decision

Validate progress-event record shape at both the shared model boundary and the
SQLite storage boundary.

## Rationale

The route is not the only future caller. Local adapters, maintenance tools,
imports, and tests must not be able to insert a malformed event record that
later appears trustworthy to teacher reporting.

## Evidence

- ADR 0912
- `packages/content-model/src/progressEventPersistence.ts`
- `apps/web/src/server/persistence/sqliteProgressionStore.ts`
