# ADR 1313: Source-Derived Unit Review Boundary

## Status

Accepted for the first MiniStar pilot review path.

## Decision

The supplied `MINISTAR ENGLISH 8 LEVELS x 40 UNITS.docx` is now represented in
the source-review workspace as a checksum-bound, review-only Unit 1 extraction
for `Genki Disco Warmup`. The record preserves the eight source vocabulary
terms and paragraph-level provenance, while explicitly recording that the
source excerpt does not contain the two target sentence structures required by
the canonical content contract.

The existing greeting demo package remains a rehearsal fixture. It must not be
silently relabeled as the source-derived Unit 1 package. Authored sentence
structures, teacher launch copy, Japanese support text, audio/media rights,
package evidence, and release approval remain separate review gates.

## Consequences

- MiniStar now has real source evidence in the same review lane a publisher
  would use.
- The source can inform authoring without becoming a draft, route target,
  assignment, QR destination, or student payload.
- DOCX pagination is treated as provisional until a reviewer confirms rendered
  page references; paragraph provenance and the source checksum remain the
  authoritative identity for this extraction.
- The next human content decision is to author and review exactly two target
  sentence structures for Unit 1.
