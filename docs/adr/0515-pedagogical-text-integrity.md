# ADR-0515: Pedagogical Text Integrity

Status: Accepted

## Context

The 8-12 vocabulary and exactly-two-sentence rules protect shape, but they do not prevent blank or duplicated content. Such content can corrupt audio mapping, game rounds, generated previews, and teacher review evidence.

## Decision

Use one shared `validatePedagogicalTextFields` contract for package/unit validation and AI authoring requests. It rejects blank terms, case-insensitive duplicate terms, and blank target sentence structures.

## Consequences

- Imported, authored, and generated content receives the same minimum text-integrity check.
- Existing tenant flexibility for 8-12 terms remains intact.
- Validation remains review-only and provider-neutral.
