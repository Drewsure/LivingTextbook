# ADR 0982: Package-Readiness Extraction Lineage

## Decision

Carry the structured extraction preview identity through package-readiness
reconciliation and provider-neutral hosted/local metadata-preview references.

Binding compares tenant, package assembly, preview identity, and source
checksum. Any drift invalidates the evidence relationship.

## Boundaries

- This is evidence reconciliation only; it does not accept extraction or
  authorize release.
- It cannot write storage, routes, playlists, assignments, or student access.
- It does not choose a hosted provider, local store, parser, OCR system, or
  deployment profile.

## Rationale

Package readiness is the point where source evidence begins to influence
release decisions. Carrying the exact preview identity prevents a later
package record from silently referring to a different extraction result.

Evidence: `packages/content-model/src/packageReadinessReconciliation.ts`,
`packages/content-model/src/packageReadinessPersistence.ts`, and
`scripts/verify-runtime-behavior.mjs`.
