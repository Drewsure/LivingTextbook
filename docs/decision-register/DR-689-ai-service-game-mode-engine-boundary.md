# DR-689: AI-Service Game-Mode And Engine Boundary

Status: Accepted

## Decision

AI generation requests must use the shared game catalog to validate mode,
parent-engine, and level compatibility before provider review preparation.

## Evidence

- The content model exposes the curated game-mode contract for provider-neutral
  consumers.
- The AI service rejects unsupported modes, unsupported engines, mismatched
  mode/engine pairs, and unavailable level/mode combinations.
- The AI service rejects an assist language that duplicates the target
  language and reports assist language as comprehension support only.
- The request carries source, compatibility, audio, media-rights, and premium
  cost evidence identifiers, and rejects support-language policies that allow
  progression.
- No provider call, billing, package write, route write, or Z.ai integration is
  enabled by this boundary.

This decision is recorded in
`docs/adr/0617-ai-service-game-mode-engine-boundary.md`.
