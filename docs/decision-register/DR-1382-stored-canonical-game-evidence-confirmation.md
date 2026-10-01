# DR-1382: Store Canonical Game Evidence Confirmation

## Decision

Require package-evidence review to persist the exact three canonical
platform-derived game evidence IDs. A generic reviewed game lane is
insufficient for bridge readiness.

## Consequences

- Reviewers must explicitly confirm curated pathways, canonical integration,
  and game-audio coverage.
- Lane-only or partial game review remains incomplete.
- Live package readiness can use one tenant/quarantine-bound stored signal.
- Release, QR, persistence, and student-use gates remain separate and blocked.

## Verification

`node scripts/verify-package-evidence-review-behavior.mjs`

`node scripts/verify-publisher-source-to-package-evidence-bridge.mjs`
