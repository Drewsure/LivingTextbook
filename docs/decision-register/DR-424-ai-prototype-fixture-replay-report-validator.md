# DR-424: AI Prototype Fixture Replay Report Validator

Date: 2026-08-14  
Status: Accepted

## Decision

AI prototype fixture replay reports must use a shared content-model validator before event replay, audio coverage, scoring replay, mobile accessibility inspection, Codex integration decisions, app patch planning, route planning, package promotion, or assignment can be considered.

## Rationale

Returned outside-builder prototypes are only useful if they can load reviewed LivingTextbook JSON fixtures. A shared validator prevents fixture replay from becoming a visual checklist that misses hard-coded unit text, tenant assumptions, hidden score writes, missing target-language audio, or support-language progress shortcuts.

## Required Evidence

- Prototype return review, integration plan, wrapper adapter review, and reviewed unit JSON fixture lineage.
- Fixture coverage for unit meta, pedagogical payload, audio cues, game mode config, scoring profile, assist language policy, and tenant theme tokens.
- Input assertions showing fixture-driven vocabulary, target sentences, audio cues, engine/mode binding, and injected tenant theme tokens.
- Output assertions showing standard event emission without direct score or reward authority.
- Replay evidence for parsed term count, parsed sentence count, audio cue requests, standard events, and tenant theme injection.
- Failure triggers for hard-coded content, tenant hard-coding, missing target-language audio, support-language progress, score/reward writes, and route or assignment side effects.

## Hard Boundaries

- No live model call.
- No direct import into `apps/web`.
- No route registry write.
- No scoring profile mutation.
- No audio manifest mutation.
- No reward inventory write.
- No student assignment.
- No support-language progress trigger.
