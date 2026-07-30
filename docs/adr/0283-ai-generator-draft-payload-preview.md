# ADR 0283: AI Generator Draft Payload Preview

Status: Accepted  
Date: 2026-07-31

## Decision

Show a concrete Draft JSON preview inside the teacher AI generator route.

The preview remains read-only and blocked from copy, verifier submission, publication, playlist creation, route creation, and assignment until persistence, verifier, rights, audio, and teacher approval workflows exist.

## Rationale

Teachers and publishers need to see what the AI generator would produce. A visible JSON-shaped preview gives product clarity while preserving the review-first architecture.

## Consequences

- The generator route now shows a sample draft payload for the sample publisher tenant.
- Target-language progress remains explicit through `target_language_progress_trigger`.
- Support-language-only progress remains blocked through `support_language_progress_allowed: false`.
- `npm run verify:ai-generator` checks the draft payload preview and route wiring.
