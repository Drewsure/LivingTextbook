# DR-996: Pilot Handoff Snapshot Scope Integrity

Decision: validate the pilot report snapshot identifier and fingerprint
namespace before treating the handoff evidence as contract-valid.

Required invariants:

- Snapshot id must match tenant, package, and launch values.
- Snapshot fingerprint must use the canonical provider-neutral prefix.
- Invalid scope or fingerprint evidence fails closed without enabling any
  write, export, recovery, or launch action.

Evidence: `docs/adr/0924-pilot-handoff-snapshot-scope-integrity.md`,
`packages/content-model/src/pilotHandoff.ts`, and
`scripts/verify-runtime-behavior.mjs`.
