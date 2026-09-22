# DR-1034: White-Label Release-Control Evidence Binding

Decision: bind release readiness to the authoritative package publish gate and
approval ledger before any promotion decision can be considered.

Required invariants:

- The release-control record matches the readiness package and release
  candidate sources.
- Blocking gate and open approval counts are derived from the authoritative
  gate and ledger records.
- A non-pilot-ready record exposes an open control; a pilot-ready record has
  zero open gates and approvals.
- Promotion and student-facing activation remain false in this review-only
  phase.

Evidence: `docs/adr/0962-white-label-release-control-evidence.md`,
`packages/content-model/src/whiteLabelReleaseReadiness.ts`,
`apps/web/src/data/sampleWhiteLabelReleaseReadiness.ts`, and
`scripts/verify-white-label-release-readiness-behavior.mjs`.
