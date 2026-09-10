# ADR-0536: Game Catalog Pedagogical Contract

Status: Accepted

## Decision

Validate each curated game catalog item for identity, exactly two target sentence structures, bounded recommended term range, and a valid supported-level list.

## Context

The game catalog is used by review panels, route readiness, pathway selection, and future engines. TypeScript interfaces protect authored code but do not guarantee that a catalog edit preserves pedagogical bounds or usable level metadata.

## Guardrails

- The item ID must match its catalog key.
- `requiredSentenceCount` must be exactly 2.
- Recommended term ranges must be ordered and within 1–12.
- Supported levels must be non-empty, unique, ascending, and within 1–8.
- Narrower mode ranges remain allowed when explicitly recorded, such as `Label It`'s 4–8 active-term range.
- This slice is verification-only; it does not enable gameplay, storage, release, assignment, or student progression.

## Consequence

Catalog edits receive deterministic feedback before route or package review can rely on them. Pedagogical bounds become part of the same acceptance gate as route, scoring, audio, replay, and engine coverage.
