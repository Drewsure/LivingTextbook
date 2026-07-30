# DR-284: AI Generation Request Builder Preview

Status: Accepted  
Date: 2026-07-31

Decision: Add a disabled teacher/admin request-builder preview to the AI teaching game generator route.

White-label impact: Positive. It shows a practical authoring flow for future textbook partners while keeping tenant-specific content, language, media, and mode choices configurable.

Cost impact: Positive. The preview keeps live prompt dispatch, model billing, and cost estimation blocked until a tenant explicitly adopts the AI package and cost controls are implemented.

Constraints:

- Source evidence, level, unit theme, target language, assist-language policy, curated mode pathway, audio coverage, and AI package state are required before generation.
- No generation, cost estimate, verifier submission, route creation, or student assignment can occur from the foundation preview.
- This decision is recorded in `docs/adr/0284-ai-generation-request-builder-preview.md`.
