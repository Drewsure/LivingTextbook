# DR-425: AI Prototype Event Replay Report Validator

Date: 2026-08-14  
Status: Accepted

## Decision

AI prototype event replay reports must use a shared content-model validator before audio coverage, scoring replay, mobile accessibility inspection, Codex integration decisions, app patch planning, route planning, package promotion, assignment, or report export can be considered.

## Rationale

Returned game prototypes must speak the LivingTextbook event language. A shared validator blocks hidden local progress, direct score authority, reward writes, route mutations, report exports, playlist writes, local bundle writes, assignment side effects, and support-language progress shortcuts before any prototype reaches app integration planning.

## Required Evidence

- Prototype fixture replay, wrapper adapter review, integration plan, standard event contract, and progress acceptance map lineage.
- Standard event coverage for `game_started`, `round_shown`, `audio_requested`, `answer_submitted`, `answer_result`, `mastery_updated`, and `game_completed`.
- Deterministic required event order.
- Allowed payload fields limited to identifiers, source text, target language, attempt metadata, and support-only flags.
- Accepted effects that remain parent-engine/report/collection preview candidates rather than direct score or reward writes.
- Failure triggers for missing start/completion events, wrong answer order, support-language mastery, direct score or reward writes, and route/report/assignment mutation.

## Hard Boundaries

- No progress event write from prototype.
- No direct score authority.
- No reward inventory write.
- No route registry write.
- No student assignment.
- No report export.
- No support-language progress trigger.
