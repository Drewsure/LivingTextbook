# ADR 0901: Canonical-Identity Browser Evidence Contents

## Status

Accepted

## Decision

The local rehearsal adapter must validate the identity of its contents, not
only the localStorage key. The progression snapshot and each event must match
the tenant, package, unit, launch, and student-session identity of the record.

## Consequences

- Cross-route or malformed events cannot silently enter a teacher evidence
  packet.
- Existing pre-v4 records are stale and are not migrated.
- The adapter remains a rehearsal aid and does not become hosted persistence.

## Verification

Run `node scripts/verify-local-evidence-tenant-key.mjs`, the persistence and
runtime checks, web typecheck, production build, and the full foundation gate.
