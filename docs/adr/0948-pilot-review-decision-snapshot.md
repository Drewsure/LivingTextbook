# ADR 0948: Pilot Review Decision Snapshot

Status: Accepted

## Context

The canonical pilot review decision has a durable record boundary, but hosted
and closed-local implementations also need a safe, versioned representation
for continuity and recovery rehearsal. Without a snapshot contract, each
adapter could invent a different shape or accidentally treat review state as
an activation command.

## Decision

Use `PilotReviewDecisionPersistenceSnapshot` for both deployment modes. The
snapshot includes the tenant/package/decision identity, a deterministic
fingerprint, review decision payload, and explicit no-side-effect flags.
Restore, export, writes, and activation remain false.

## Consequences

- Hosted and local implementations can share validation and replay evidence.
- Fingerprint and identity checks make drift visible before any future write.
- Production retention, audit, and provider policy remain separate gates.

## Verification

- `node scripts/verify-pilot-review-decision-snapshot.mjs`
- `npm run verify:foundation-composition`
- `npm run typecheck --workspace @living-textbook/web`
