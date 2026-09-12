# @living-textbook/ai-service

Provider-neutral backend boundary for worksheet ingestion, AI analysis, document parsing, and structured game-content generation.

## Current stage

The service is contract-complete for review-only request preparation and validation. It does not call a model, accept a file upload, charge a provider, write a package, submit a verifier result, or activate a student route.

The boundary deliberately owns the rules that must survive any future provider:

- 8-12 vocabulary terms per canonical unit.
- Exactly 2 target sentence structures.
- Target-language content remains the only progression authority.
- Support language remains comprehension support and cannot unlock progress.
- If configured, assist language must differ from the target language and is explicitly non-authoritative for scoring, mastery, and progression.
- Source package review, tenant identity, game mode, engine binding, audio coverage, media rights, cost policy, and teacher approval remain explicit request evidence.
- The request carries tenant-scoped evidence identifiers for source review, activity compatibility, target-language audio, media rights, and premium AI cost policy; readiness booleans cannot stand alone as provenance.
- The support-language policy is explicit and must declare `progressionAllowed: false`.
- The service must resolve game mode compatibility through the shared content-model catalog. Provider requests are rejected when the mode is unsupported, the parent engine is unsupported, the mode and engine disagree, or the mode is outside its curated level range.
- Provider dispatch remains blocked until the request passes review and a later Codex-controlled release decision opens it.

## Contract

`src/index.ts` exposes:

- `AiGenerationServiceRequest`, a backend-neutral request shape.
- `validateAiGenerationServiceRequest`, a deterministic validation function.
- `prepareReviewOnlyAiGenerationRequest`, a no-side-effect preparation function.
- `AiGenerationServiceResult`, a stable result envelope for future hosted or local adapters.

The service must remain independent of web routes, student progression state, provider SDKs, storage vendors, and Phaser/game view code.

Run `npm run typecheck --workspace @living-textbook/ai-service` from the repository root to verify the boundary.
