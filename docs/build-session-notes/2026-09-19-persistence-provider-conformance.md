# Build Session: Persistence Provider Conformance

## Goal

Harden the provider-neutral progression seam before selecting a production
backend or enabling live classroom writes.

## Delivered

- Added deterministic, key-sorted progression payload fingerprints.
- Applied the same replay/conflict behavior to process-memory and SQLite.
- Fixed SQLite existing-row replay reads to retain the stored idempotency key.
- Added temporary-data conformance coverage for first writes, exact replays,
  changed payload conflicts, cross-tenant conflicts, scoped reads, and SQLite
  restart durability.
- Kept all policy and release gates unchanged.

## Verification

- `node scripts/verify-persistence-provider-conformance.mjs`
- `node scripts/verify-persistence-runtime.mjs`
- Full foundation verification remains the required release gate.

## Boundary

This session does not choose a cloud provider, enable durable classroom writes,
store learner audio or transcripts, or promote frozen Z.ai/Phaser source.
