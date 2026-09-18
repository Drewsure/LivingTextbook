# Persistence Adapter Seam Checks

## Purpose

The progression API must not know whether a deployment uses process memory,
closed/local SQLite, or a future hosted relational provider. Provider choice is
server-owned and must sit behind one provider-neutral adapter seam.

## Required Invariants

- The adapter exposes provider and durability explicitly.
- Process-memory rehearsal remains non-durable and idempotent.
- SQLite remains server-only, tenant-scoped, and policy-gated.
- The progression route delegates reads and writes to the adapter.
- Operations and status routes use the same provider-selection helper.
- Provider credentials never cross into the browser route contract.
- No provider credentials are returned to browser clients.
- An unsupported provider value fails closed with a blocked deployment state;
  it never silently becomes rehearsal storage.
- Content, scoring, audio, QR, and progression event vocabulary remain
  provider-independent.

## Verification

```text
node scripts/verify-persistence-adapter-seam.mjs
npm run verify:foundation
```

This seam does not select a cloud vendor or enable durable writes.
