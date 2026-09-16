# ADR 0817: Persistence Evidence Chain

## Decision

Make every persistence operation receipt part of a tamper-evident hash chain.
The SQLite store backfills chain hashes for existing metadata receipts,
verifies the chain during health diagnostics, and exposes only the resulting
integrity state through teacher-safe status.

## Rationale

Checksums prove the identity of a backup artifact, but they do not show that a
receipt row itself was changed later. A chained receipt gives the closed pilot
a low-cost integrity signal that is useful for support and handoff without
creating another learner-data store.

## Guardrails

- Receipt hashes cover canonical metadata only.
- Raw student-session identifiers, progression payloads, raw audio, transcripts,
  credentials, and database paths remain prohibited.
- A failed chain is blocked from being described as healthy.
- The chain does not replace access control, encryption, immutable external
  audit storage, or a production backup service.
- The browser remains read-only and cannot repair, rewrite, or delete receipts.

## Verification

Run `npm run verify:durable-operations`, web typecheck, production build, and
active-route verification after changes. See
`docs/verification/PERSISTENCE_EVIDENCE_CHAIN_CHECKS.md`.
