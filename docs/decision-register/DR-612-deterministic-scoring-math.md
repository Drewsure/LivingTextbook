# DR-612: Deterministic Scoring Math

Status: Accepted

Decision: Validate scoring profile arithmetic and clamp helper output to the declared completion cap.

Rationale:

- Reward math must be bounded before integration.
- Exact component totals make scoring explainable.
- Clamping protects against oversized caller minimums.

Guardrails:

- Components and caps are non-negative integers.
- Components sum exactly to the cap.
- The cap stays within 1,000 Star Dust per unit.
- Accuracy-derived results cannot exceed the cap.
- The gate has no progression or inventory side effect.

See also: `docs/adr/0540-deterministic-scoring-math.md`.
