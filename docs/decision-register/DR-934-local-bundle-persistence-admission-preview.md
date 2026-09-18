# DR-934: Local Bundle Persistence Admission Preview

## Decision

Join local bundle handoff evidence to the shared provider-neutral persistence
handoff through a typed, review-only admission preview.

## Required Invariants

- The local handoff and persistence packets must both validate.
- `local-companion-handoff` must be present in tenant-bound persistence
  coverage with durable, hosted, and local intent evidence.
- Provider selection remains null.
- Durable write, package write, offline activation, student promotion, and
  hosted redirect mutation remain false.

## Verification

`node scripts/verify-local-bundle-persistence-admission.mjs` exercises valid
and unsafe previews. The runtime is included in
`node scripts/verify-local-bundle-readiness.mjs` and the full foundation gate.

## Excluded

No provider selection, database write, package export, installer, offline
activation, redirect mutation, or student promotion is enabled.

See ADR 0862 and
`docs/adr/0862-local-bundle-persistence-admission-preview.md`.
