# ADR 0900: Tenant-Scoped Browser Evidence Key

## Status

Accepted

## Decision

Browser rehearsal evidence must be stored under a key containing tenant,
content package, launch code, and student-session identity. The stored record
must also be checked against the same lookup before it is returned.

## Consequences

- Identical launch codes used by different white-label tenants cannot collide
  in one browser profile.
- A teacher review panel reads only the expected tenant/package/student record.
- Existing launch-only rehearsal keys are intentionally treated as stale after
  the storage contract version change; no migration or hosted write is created.
- This remains browser rehearsal evidence, not durable institutional storage.

## Verification

Run the tenant-key verifier, persistence/runtime checks, web typecheck,
production build, and the full foundation gate.
