# DR-1022: Pilot Review Decision Runtime Verification

Decision: verify the review-decision snapshot adapter through executable
runtime rehearsal before provider activation.

The rehearsal rejects wrong-tenant input and fingerprint tampering, keeps
restore/write/export/activation blocked, and proves no side effect.

Evidence: `docs/adr/0950-pilot-review-decision-runtime.md` and
`scripts/verify-pilot-review-decision-snapshot-runtime.mjs`.
