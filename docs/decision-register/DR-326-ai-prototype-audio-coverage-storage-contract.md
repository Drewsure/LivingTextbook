# DR-326: AI Prototype Audio Coverage Storage Contract

## Decision

The platform will preserve AI prototype audio coverage reports as backend-neutral durable records before returned prototypes can claim audio or integration readiness.

## Rationale

Audio coverage must be a verifiable product contract, not only a visible review panel. The platform needs a record that proves target-language tap-to-speak, control replay, support-language support-only behavior, background-media learning-audio priority, and blocked cost/side-effect behavior across hosted and closed local deployments.

## Implementation Notes

- The storage contract is `ai_prototype_audio_coverage_report` / `ai-prototype-audio-coverage-report`.
- Schema draft, migration candidates, migration specs, durable records, persistence adapter plans, and route verification now include the record.
- The record preserves audio cue manifest id, package game audio coverage id, background media policy binding id, required cue families, target-language audio checks, control audio checks, support-language audio rules, audio replay evidence, failure triggers, and blocked actions.
- Generated voice calls, voice API cost, audio manifest mutation, playlist writes, package audio-complete markers, media-only mastery, support-language progress, direct app import, package promotion, and assignments remain blocked.
- Hosted and local classroom deployment paths use the same contract shape.

## Follow-Up

Keep the next prototype review records focused on mobile/accessibility and scoring replay before any returned game can move toward `apps/web` integration.
