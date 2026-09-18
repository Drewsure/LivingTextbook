# DR-933: Local Bundle Handoff Storage Alignment

## Decision

Align the provider-neutral `local_companion_handoff` schema, migration
candidate, and migration spec with the shared review-only handoff packet.

## Required Fields

- `packet_id`, `mode`, and `summary` identify the review packet.
- `checks` preserves manifest, asset, route, release, and side-effect evidence.
- `blocked_actions` preserves package-write, offline-activation,
  student-promotion, and hosted-redirect-mutation blockers.

## Verification

`node scripts/verify-local-bundle-handoff-storage.mjs` checks all three
planning layers. The check also runs from
`node scripts/verify-local-bundle-readiness.mjs` and the full foundation gate.

## Excluded

No database adapter, package writer, exporter, installer, offline activation,
redirect mutation, or student promotion is enabled.

See ADR 0861 and
`docs/adr/0861-local-bundle-handoff-storage-alignment.md`.
