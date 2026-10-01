# DR-1394: Package reconciliation evidence reference binding

- **Decision:** Carry exact publisher evidence request IDs into package
  reconciliation lanes.
- **Why:** The package review packet must retain the same evidence provenance
  established by intake, manifest, and review-handoff contracts.
- **Scope:** Package evidence content model, derivation, validation, panel,
  and verifier. No file upload, approval, assembly, release, or student use.
- **Acceptance:** Known evidence IDs are preserved by asset intersection;
  unknown and unmapped evidence fails closed; the game lane remains derived
  only; foundation verification remains green.
- **Owner:** Codex architecture and integration review.
- **Next gate:** Human adjudication of the real publisher evidence records.
