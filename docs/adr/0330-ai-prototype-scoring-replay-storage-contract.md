# ADR 0330: AI Prototype Scoring Replay Storage Contract

## Status

Accepted

## Context

The review-only scoring replay report makes returned prototype scoring risks visible in generator routes. The same evidence must also have a backend-neutral storage contract before any hosted or closed local pilot can treat that report as durable.

Without this contract, a polished external prototype could claim scoring readiness while bypassing the parent scoring profile, writing Star Dust, mutating rewards, treating media-only activity as mastery, or letting support-language activity unlock target-language progress.

## Decision

Add a backend-neutral `ai_prototype_scoring_replay_report` / `ai-prototype-scoring-replay-report` storage contract across schema draft, migration candidates, migration specs, durable records, persistence adapter plans, and route verification.

The contract preserves game scoring profile snapshot id, progress event acceptance map id, collection unlock binding id, standard event contract id, deterministic scoring replay, score replay checks, mastery replay checks, reward boundary checks, failure triggers, and blocked actions.

## Consequences

- Returned prototypes cannot claim scoring, Star Dust, mastery, reward, package promotion, or assignment readiness without durable scoring replay evidence.
- Hosted and closed local deployments use the same record shape.
- Direct score authority, scoring profile overrides, Star Dust writes, reward inventory writes, random rewards, media-only mastery, support-language mastery, package promotion, and assignments remain blocked.
- MiniStar Japanese support remains support-only; English remains the target-language scoring trigger.
