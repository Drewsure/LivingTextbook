# ADR 0322: AI Prototype Fixture Replay Report Storage Contract

## Status

Accepted

## Context

ADR 0321 added review-only fixture replay reports to prove returned prototypes load reviewed JSON fixtures instead of hard-coded vocabulary, sentences, tenant visuals, audio assumptions, scoring shortcuts, reward writes, or route side effects.

That report also needs a backend-neutral storage contract before it can become durable evidence for hosted pilots or closed local textbook companion deployments.

## Decision

Add `ai_prototype_fixture_replay_report` / `ai-prototype-fixture-replay-report` as a backend-neutral storage category across schema drafts, migration candidates, migration specs, durable record plans, hosted adapter plans, local adapter plans, persistence boundaries, and backend readiness verification.

The record must preserve reviewed unit JSON fixture id, fixture coverage, input assertions, output assertions, replay evidence, failure triggers, target-language progress requirements, support-language blocks, tenant-theme injection evidence, and blocked actions.

## Consequences

- Returned prototypes cannot claim fixture readiness from UI review alone.
- Hosted and local deployments share the same evidence shape.
- Hard-coded unit text, tenant hard-coding, support-language progress triggers, score authority, audio manifest authority, reward inventory writes, direct imports, package promotion, and assignments remain blocked until later review gates pass.
