# ADR 0979: Structured Source Extraction Preview

## Decision

Introduce a provider-neutral, review-only source extraction preview contract
before any real PDF/DOCX upload or parser promotion is enabled.

The preview accepts extracted segment metadata and preserves tenant, source,
package, checksum, page, sequence, unit, and segment-kind identity. It derives
only deterministic normalized text and unit page summaries in memory.

## Boundaries

- The preview is not a file upload endpoint or parser implementation.
- It performs no storage write and cannot create a teacher draft, package,
  route, assignment, or student payload.
- AI-assisted extraction remains a reviewer suggestion and carries an explicit
  warning.
- Missing lineage, checksum, page/order, unit mapping, or text evidence fails
  closed.

## Rationale

This gives publisher PDF/text intake a stable shared seam without choosing a
storage vendor or allowing an extraction result to bypass review, audio,
rights, target-language, or release gates.

Evidence: `packages/content-model/src/sourceExtractionPreview.ts` and
`scripts/verify-source-extraction-preview.mjs`.
