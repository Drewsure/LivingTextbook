# Foundation Durable Persistence Checks

## Purpose

The foundation gate must cover the real server-only persistence boundary, not
only its review panels and schema drafts. These checks keep durable persistence
opt-in, tenant-scoped, recoverable, and separate from the non-durable rehearsal
path.

## Required Checks

- Durable progression storage verifies SQLite identity isolation, idempotency,
  signed session boundaries, server-owned policy, and excluded raw audio and
  transcript fields.
- Durable operations verify backup, checksum, integrity, restore, retention
  deletion, tamper-evident operation evidence, and tenant-scoped filtering.
- Teacher operations authorization verifies a separate expiring review session
  and prevents student gameplay access from exposing operations history.
- Cross-route persistence verifies progression handoff and gated hosted reads
  and writes.
- The production build and all active routes remain part of the same gate.

## Commands

```text
npm run verify:durable-persistence
npm run verify:durable-operations
npm run verify:cross-route-persistence
npm run verify:foundation
```

Passing these checks proves the boundary is implemented and guarded. It does
not select a cloud vendor or authorize durable writes for a deployment.
