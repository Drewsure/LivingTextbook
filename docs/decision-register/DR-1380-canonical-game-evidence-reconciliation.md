# DR-1380: Canonical Game Evidence Reconciliation

## Decision

Bind the complete canonical game evidence set at publisher package
reconciliation and keep publisher assets and platform-derived records on their
own lanes.

## Context

The package evidence review already distinguished origin values. Reconciliation
needed the stronger rule that canonical game coverage is complete and cannot be
replaced by uploaded or unrelated derived records.

## Consequences

- Canonical game integration, curated pathways, and game audio are all visible.
- The package cannot appear game-ready from a partial or mis-sourced record.
- Publisher media rights and accessibility evidence remain independently required.
- Release, QR, persistence, and student-use gates remain blocked.

## Verification

`node scripts/verify-publisher-submission-package-evidence-reconciliation.mjs`

`npm run verify:foundation-composition`
