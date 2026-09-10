# ADR-0533: Unit Metadata Enum Integrity

Status: Accepted

## Decision

Validate runtime unit metadata identifiers against the shared curated catalogs for game modes, game families, and parent engines.

## Context

The content model receives data from PDF extraction, AI authoring drafts, tenant imports, and future partner packages. TypeScript unions protect authored code but do not protect parsed JSON at runtime. An unknown identifier can therefore pass basic shape checks and later be misrouted by a game pathway or engine adapter.

## Guardrails

- Unknown game modes are rejected.
- Unknown game families are rejected.
- Unknown parent engines are rejected.
- No value is silently coerced or mapped to a nearest catalog entry.
- Adding a new identifier requires an explicit catalog update, compatibility review, and regression test.
- This slice remains validation-only; it does not enable gameplay, storage, release, assignment, or student progression.

## Consequence

Imported packages receive deterministic repair feedback before review or release. The catalog remains a deliberate integration boundary for the white-label platform and its tenant-specific pathways.
