# ADR 0984: End-to-End Extraction-to-Readiness Binding

## Decision

Validate package-readiness reconciliation directly against the structured
extraction preview named by its source assembly evidence.

The binding compares tenant, target package, extraction preview ID, and source
checksum and fails closed on missing or mismatched values.

## Boundaries

- This is evidence reconciliation only; it does not accept extraction or
  create a draft.
- It cannot write storage, promote packages, create routes or playlists,
  assign learners, or activate student access.
- The source assembly binding remains required; this validator closes the gap
  between the intermediate assembly and final readiness record.

## Rationale

An intermediate record ID alone is not sufficient proof for a saleable
white-label content pipeline. Direct validation prevents a readiness record
from appearing healthy while pointing at a different extraction result.

Evidence: `packages/content-model/src/packageReadinessReconciliation.ts`,
`apps/web/src/data/samplePackageReadinessReconciliation.ts`, and
`scripts/verify-runtime-behavior.mjs`.
