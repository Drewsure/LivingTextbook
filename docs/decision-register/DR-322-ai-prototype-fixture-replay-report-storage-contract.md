# DR-322: AI Prototype Fixture Replay Report Storage Contract

## Decision

The platform will preserve `ai_prototype_fixture_replay_report` / `ai-prototype-fixture-replay-report` as a backend-neutral storage contract before returned prototypes can claim reviewed fixture loading, target-language progress, tenant theme injection, audio safety, scoring safety, package promotion, or assignment readiness.

## Rationale

Fixture replay reports are a critical anti-shortcut gate for AI-built or externally-built game prototypes. Without durable records, a prototype could appear correct in a screen preview while still hiding hard-coded unit content, tenant-specific assumptions, support-language progress triggers, or direct scoring/reward behavior.

## Implementation Notes

- Backend schema entity: `ai_prototype_fixture_replay_report`.
- Migration candidate: `m064-ai-prototype-fixture-replay-report-records`.
- Migration spec: `spec-ai-prototype-fixture-replay-report`.
- Durable record category: `ai-prototype-fixture-replay-report`.
- Hosted/local adapter write intents must preserve reviewed unit JSON fixture id, fixture coverage, input/output assertions, replay evidence, failure triggers, target-language progress requirements, support-language blocks, and blocked actions.
- The record cannot create routes, scoring changes, audio manifest changes, reward inventory, package promotion, assignments, or student-facing release.

## Follow-Up

Later implementation may add a real replay harness and evidence export after storage adapter selection, reviewer identity, and package approval rules are accepted.
