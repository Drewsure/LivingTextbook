# ADR 0903: Browser Evidence Runtime Harness

## Status

Accepted

## Decision

The browser rehearsal evidence adapter must have an executable runtime harness,
not only source-marker checks. The harness must prove valid acceptance,
tenant-isolated reads, mixed-session rejection without mutation, and malformed
blank-identity rejection.

## Consequences

- The local evidence boundary is tested against behavior as well as structure.
- The harness uses an in-memory browser-storage double and never touches a real
  browser profile or hosted persistence provider.
- This remains rehearsal evidence and does not authorize production storage.

## Verification

Run `node scripts/verify-local-evidence-runtime.mjs` and the full foundation
gate.
