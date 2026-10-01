# DR-1379: Semantic Evidence Origin Lanes

## Decision

Require package-evidence origins to match their lane before release lineage can
be considered complete.

## Context

The previous boundary validated that origins were safe strings but did not
reject a semantically incorrect origin on a valid lane.

## Consequences

- Canonical game evidence remains visibly platform-derived.
- Publisher media and content remain publisher-asset evidence.
- A custody mismatch fails closed before delivery release.
- All assembly, promotion, QR, persistence, and student-use gates remain unchanged.

## Verification

`node scripts/verify-package-evidence-review-behavior.mjs`

`npm run verify:foundation-composition`
