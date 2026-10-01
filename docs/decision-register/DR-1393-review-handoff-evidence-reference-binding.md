# DR-1393: Review handoff evidence reference binding

- **Decision:** Carry exact structured evidence request IDs into each publisher
  review-handoff lane.
- **Why:** Generic required-evidence prose was not sufficient provenance for a
  saleable publisher review workflow.
- **Scope:** Review-handoff content model, derivation, validation, panel, and
  verifier. No approval or write capability.
- **Acceptance:** Covered asset lanes contain known evidence IDs; all manifest
  evidence requests are mapped; unknown and unmapped evidence fails closed; the
  foundation gate remains green.
- **Owner:** Codex architecture and integration review.
- **Next gate:** Human adjudication of the real evidence records.
