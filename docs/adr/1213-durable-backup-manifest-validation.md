# ADR 1213: Durable Backup Manifest Validation

**Status:** Accepted  
**Date:** 2026-09-25

## Context

The SQLite persistence adapter already protects tenant scope, integrity checks,
retention evidence, and activation gates. Restore evidence still needs a
complete runtime contract so a checksum-only match cannot hide a stale schema,
invalid retention value, malformed timestamp, incorrect byte count, or privacy
flag that would include raw learner material.

## Decision

Create and validate durable backup manifests on backup, then validate them
again before restore using a pure shared contract.
The validator requires the supported manifest and SQLite schema versions,
artifact identity, positive byte and retention values, a lowercase SHA-256
digest, a valid creation timestamp, and explicit exclusion of raw learner
audio and learner transcripts. Restore compares the manifest with the actual
source byte count and checksum and keeps the existing explicit operations,
school-policy, retention-policy, and release-approval gates.

## Consequences

- Corrupt, stale, incomplete, or privacy-unsafe backup and restore packets fail
  closed.
- Manifest validation is independently executable without opening a database or
  enabling persistence operations.
- The adapter remains reviewable and gated; this decision does not activate
  hosted writes, browser mutation routes, or external backup custody.

## Verification

`npm run verify:durable-operations` runs the SQLite smoke test, static contract
checks, and positive/negative backup-manifest validation.
