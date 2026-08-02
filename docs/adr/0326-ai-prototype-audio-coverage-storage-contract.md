# ADR 0326: AI Prototype Audio Coverage Storage Contract

## Status

Accepted

## Context

The review-only AI prototype audio coverage report is visible in generator routes, but future backend or local deployments need the same boundary expressed as durable records. Without a storage contract, an outside prototype could appear to have audio coverage while still mutating audio manifests, writing playlists, triggering generated voice cost, counting media-only listening as mastery, or marking a package audio-complete too early.

This matters for young learners, speech-matching games, speaking modes, support-language boundaries, local textbook deployments, and white-label tenants that may choose different voice, media, and cost policies.

## Decision

Add a backend-neutral `ai_prototype_audio_coverage_report` / `ai-prototype-audio-coverage-report` storage contract across schema draft, migration candidates, migration specs, durable records, persistence adapter plans, and route verification.

The contract preserves audio cue manifest id, package game audio coverage id, background media policy binding id, required cue families, target-language audio checks, control audio checks, support-language audio rules, audio replay evidence, failure triggers, and blocked actions.

## Consequences

- Returned prototypes cannot claim audio, wrapper, playlist, package, audio-complete, promotion, or assignment readiness without durable audio coverage evidence.
- Hosted and closed local deployments use the same record shape.
- Generated voice calls and voice API cost remain blocked until future tenant entitlement and cost policy exists.
- Audio reports cannot mutate audio manifests, write playlists, mark package audio complete, count media-only mastery, trigger support-language progress, import app code, promote packages, or create assignments.
- MiniStar Japanese support audio remains support-only and cannot unlock English progress.
