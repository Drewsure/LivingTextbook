# ADR 0295: AI Generated Draft Payload Validator

Status: Accepted  
Date: 2026-07-31

## Decision

Add a shared content-model validator for AI-generated draft payloads and draft preview shells.

The validator enforces the 8-12 vocabulary range, exactly 2 target sentences, target-language-only progress, support-language and media-only progress blocking, required teacher draft verifier submission state, required blocked draft actions, next required records, and target-language audio approval before student use.

## Rationale

The AI teaching game generator is a premium white-label authoring feature, but generated output must not become trusted simply because it came from a prompt package. Validation belongs in the shared content model so UI panels, future APIs, storage adapters, verifier queues, and local/offline tools can reuse the same gate.

## Consequences

- The teacher generator route shows schema guard blocks and warnings beside the Draft JSON preview.
- Generated drafts remain review-only while target audio, media rights, verifier submission, approval, storage, routes, playlists, and assignments are incomplete.
- Future live AI generation must call the shared validator before persistence or review workflow promotion.
- `npm run verify:ai-generator` checks the validator and visible route markers.
