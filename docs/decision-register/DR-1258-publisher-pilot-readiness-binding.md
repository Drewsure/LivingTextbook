# DR-1258: Publisher Pilot Readiness Binding

## Decision

Create a shared review-only binding for the first white-label publisher pilot.
It records the identities of the source quarantine, package review packet,
assembly preflight, package preview, readiness reconciliation, delivery
manifest, release receipt, package index, and optional hosted persistence
decision packet.

## Why now

The saleable pilot needs a single handoff view before any publisher package can
be assembled or released. Separate readiness panels were correct individually
but left the cross-route lineage implicit.

## Guardrails

- All checks must be present and uniquely identified.
- A binding is blocked when any check is open or blocked.
- The binding is always review-only, side-effect-free, and metadata-only.
- Package assembly, promotion, QR printing, hosted writes, and student use are
  not authorized by this record.
- Hosted persistence remains a separate explicit opt-in; closed-local remains a
  complete fallback.

## Verification

`verify-publisher-pilot-package-readiness-binding.mjs` validates the shared
contract, sample lineage, handoff route integration, and prohibited behavior.
