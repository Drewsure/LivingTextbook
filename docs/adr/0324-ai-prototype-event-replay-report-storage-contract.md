# ADR 0324: AI Prototype Event Replay Report Storage Contract

## Status

Accepted

## Context

ADR 0323 added review-only event replay reports to prove returned prototypes emit the LivingTextbook standard event contract without hidden local progress, score authority, reward writes, report exports, route mutations, playlist writes, local bundle writes, or assignments.

The report needs a backend-neutral storage contract before it can become durable evidence for hosted pilots or closed local textbook companion deployments.

## Decision

Add `ai_prototype_event_replay_report` / `ai-prototype-event-replay-report` as a backend-neutral storage category across schema drafts, migration candidates, migration specs, durable record plans, hosted adapter plans, local adapter plans, persistence boundaries, and backend readiness verification.

The record must preserve standard event contract id, progress event acceptance map id, standard event coverage, required event order, allowed payload fields, accepted progress effects, failure triggers, target-language progress requirements, support-language blocks, and blocked actions.

## Consequences

- Returned prototypes cannot claim event readiness from UI review alone.
- Hosted and local deployments share the same event evidence shape.
- Hidden progress streams, score authority, reward inventory writes, route state ownership, report exports, playlist writes, local bundle writes, direct imports, package promotion, and assignments remain blocked until later review gates pass.
