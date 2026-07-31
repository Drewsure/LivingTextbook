# DR-324: AI Prototype Event Replay Report Storage Contract

## Decision

The platform will preserve `ai_prototype_event_replay_report` / `ai-prototype-event-replay-report` as a backend-neutral storage contract before returned prototypes can claim standard event, progress, reporting, scoring, reward, route, playlist, local bundle, package promotion, or assignment readiness.

## Rationale

Event replay evidence must not live only in a page preview. A durable event replay record protects teacher reports, mastery, earned collection, launch safety, white-label tenant behavior, and closed local deployments from hidden prototype behavior.

## Implementation Notes

- Backend schema entity: `ai_prototype_event_replay_report`.
- Migration candidate: `m065-ai-prototype-event-replay-report-records`.
- Migration spec: `spec-ai-prototype-event-replay-report`.
- Durable record category: `ai-prototype-event-replay-report`.
- Hosted/local adapter write intents must preserve standard event coverage, required event order, allowed payload fields, accepted progress effects, failure triggers, target-language progress requirements, support-language blocks, and blocked actions.
- The record cannot create progress writes, scoring changes, reward inventory, report exports, routes, playlists, local bundles, package promotion, assignments, or student-facing release.

## Follow-Up

Later implementation may add a real replay harness and evidence export after storage adapter selection, reviewer identity, and package approval rules are accepted.
