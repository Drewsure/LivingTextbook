# DR-1381: Canonical Game Readiness Signal

## Decision

Separate “game lane reviewed” from “complete canonical game evidence set
bound.” The source-to-package bridge accepts only the latter as a signal that
the game-verification lane may be marked present.

## Context

The package evidence review stores one lane-level game reference, while the
canonical reconciliation requires three distinct platform-derived game
records. Treating lane presence as completeness would create inconsistent
readiness decisions across teacher workspaces and downstream release lineage.

## Consequences

- Partial game review remains visibly blocked.
- The live source and package readiness routes fail closed until a trusted
  reconciliation record is available.
- The complete canonical game set has one named signal for future binding.
- Review status still cannot authorize release or student use.

## Verification

`node scripts/verify-publisher-source-to-package-evidence-bridge.mjs`

`node scripts/verify-source-package-evidence-binding.mjs`
