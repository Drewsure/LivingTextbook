# ADR 0981: Source-to-Package Extraction Binding

## Decision

Require every source package assembly packet to reference the exact structured
extraction preview that supplied its source evidence.

The binding compares tenant, source, target package, source checksum, and
preview identity. It also confirms that the preview remains review-only and
cannot write storage or produce a student payload.

## Boundaries

- A valid binding does not accept the extraction or authorize package release.
- It cannot create drafts, routes, assignments, persistence records, or live
  classroom sessions.
- The binding is provider-neutral and does not select a parser, OCR provider,
  storage vendor, or deployment mode.

## Rationale

Source review evidence must be traceable to the exact extraction result used by
later package-readiness records. This prevents silent source drift while
preserving the governed review sequence.

Evidence: `packages/content-model/src/sourcePackageAssembly.ts`,
`packages/content-model/src/sourceExtractionPreview.ts`, and
`scripts/verify-runtime-behavior.mjs`.
