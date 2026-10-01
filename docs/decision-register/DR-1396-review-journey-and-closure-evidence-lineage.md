# DR-1396: Review journey and closure evidence lineage

- **Decision:** Carry exact publisher evidence request IDs into the package
  review journey and delivery closure packet.
- **Why:** Final operator review must retain the structured provenance already
  established by intake, manifest, reconciliation, and immutable review.
- **Scope:** Shared journey and closure contracts, live closure adapter,
  operator panels, fixtures, and verification. No release or student action.
- **Acceptance:** Journey and closure require unique non-empty request IDs;
  the live closure derives them from immutable review; full foundation checks
  remain green.
- **Owner:** Codex architecture and integration review.
- **Next gate:** Human adjudication and release authorization for a real
  publisher package.
