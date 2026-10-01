# DR-1395: Immutable package review publisher request IDs

- **Decision:** Preserve exact publisher evidence request IDs on immutable
  package-evidence references and delivery handoff references.
- **Why:** Generic lane review IDs were not enough to prove that the final
  package review still referred to the publisher's structured rights,
  accessibility, and scan evidence requests.
- **Scope:** Shared package-evidence contract, capture route, immutable
  quarantine record, delivery handoff, fixtures, and verification. No upload,
  approval, assembly, release, or student use.
- **Acceptance:** Publisher lanes require safe request IDs; the game lane
  rejects publisher request IDs; downstream handoff preserves the field; all
  foundation checks remain green.
- **Owner:** Codex architecture and integration review.
- **Next gate:** Human adjudication of the real publisher evidence records.
