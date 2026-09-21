# ADR 0900: Canonical-Identity Browser Evidence Key

## Status

Accepted

## Decision

Browser rehearsal evidence must be stored under a key containing tenant,
content package, launch code, unit, and student-session identity. The stored
progression and every stored event must preserve the same unit, launch,
student-session, and tenant metadata before the record is returned or merged.

## Consequences

- Identical launch codes or unit routes used by different white-label tenants
  cannot collide in one browser profile.
- A teacher review panel reads only the expected tenant/package/unit/student
  record.
- Cross-unit, cross-launch, cross-student, and cross-tenant event batches are
  rejected before they can be merged into local evidence.
- Existing pre-v4 rehearsal keys are intentionally treated as stale after the
  storage contract version change; no migration or hosted write is created.
- This remains browser rehearsal evidence, not durable institutional storage.

## Verification

Run the tenant-key verifier, persistence/runtime checks, web typecheck,
production build, and the full foundation gate.
