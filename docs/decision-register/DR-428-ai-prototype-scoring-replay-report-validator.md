# DR-428: AI Prototype Scoring Replay Report Validator

Date: 2026-08-14  
Status: Accepted

## Decision

AI prototype scoring replay reports must use a shared content-model validator before Codex integration decisions, app patch planning, route planning, package promotion, assignment, Star Dust writes, mastery updates, reward writes, random rewards, or collection unlocks can be considered.

## Rationale

Returned game prototypes should provide answer evidence, not scoring authority. A shared scoring replay guard keeps Star Dust, mastery, deterministic rewards, collection unlocks, and tenant reward skins inside the parent platform contracts while blocking support-language, media-only, and random reward shortcuts.

## Required Evidence

- Prototype scoring replay, integration plan, game scoring profile snapshot, progress event acceptance map, collection unlock binding, and standard event contract lineage.
- Deterministic scoring replay against the reviewed parent scoring profile.
- Score input records from reviewed unit fixtures, standard `answer_result` events, attempt metadata, target-language flags, and support-only flags.
- 1,000 Star Dust cap and 75% mastery threshold remain parent-engine rules.
- Support-language and media-only interactions cannot produce mastery or Star Dust.
- Collection unlocks, Spin Wheel tickets, avatar evolution, and random rewards remain outside prototype code.

## Hard Boundaries

- No scoring profile mutation.
- No direct score authority.
- No Star Dust write from prototype.
- No reward inventory write.
- No random reward generation.
- No media-only Star Dust.
- No support-language-only mastery.
- No package promotion.
- No student assignment.
