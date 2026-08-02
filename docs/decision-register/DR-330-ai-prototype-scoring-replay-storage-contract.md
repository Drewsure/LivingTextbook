# DR-330: AI Prototype Scoring Replay Storage Contract

## Decision

The platform will preserve AI prototype scoring replay reports as backend-neutral durable records before returned prototypes can claim scoring or integration readiness.

## Rationale

External prototype work can speed up game development only if score, mastery, Star Dust, and reward effects remain owned by the LivingTextbook parent engine and platform gates. The storage contract makes deterministic scoring replay evidence durable across hosted and closed local deployments before any returned prototype can affect real progress.

## Implementation Notes

- The storage contract is `ai_prototype_scoring_replay_report` / `ai-prototype-scoring-replay-report`.
- Schema draft, migration candidates, migration specs, durable records, persistence adapter plans, and route verification now include the record.
- The record preserves game scoring profile snapshot id, progress event acceptance map id, collection unlock binding id, standard event contract id, deterministic scoring replay, score replay checks, mastery replay checks, reward boundary checks, failure triggers, and blocked actions.
- Direct score authority, scoring profile overrides, Star Dust writes, reward inventory writes, random rewards, media-only mastery, support-language mastery, package promotion, and assignments remain blocked.
- Hosted and local classroom deployment paths use the same contract shape.

## Follow-Up

Keep the next prototype integration foundation step focused on generated-package promotion safety and parent-engine wrapper review before any returned game can move toward student-facing routes.
