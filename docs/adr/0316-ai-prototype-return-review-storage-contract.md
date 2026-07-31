# ADR 0316: AI Prototype Return Review Storage Contract

Date: 2026-07-31

## Status

Accepted.

## Context

AI prototype return reviews define how Z.ai or outside builder work comes back into the LivingTextbook process. The review gate is useful only if its evidence is durable and auditable across hosted, local, and hybrid deployment paths.

Without a storage contract, returned prototype evidence could be tracked informally, making it easier for route writes, scoring changes, audio manifest changes, assignments, or student-facing previews to happen without a complete review trail.

## Decision

Add `ai_prototype_return_review` / `ai-prototype-return-review` as a backend-neutral storage category across schema drafts, migration candidates, migration specs, durable record plans, hosted adapter plans, local adapter plans, and persistence boundaries.

The record must preserve returned artifact evidence, parent-engine wrapper review, JSON fixture conformance, standard event replay, audio cue coverage review, deterministic scoring review, mobile accessibility review, white-label fit review, and blocked return actions.

Hosted and local adapters must block production merge, route writes, scoring profile mutations, audio manifest mutations, direct assignment, and student-facing prototype previews.

## Consequences

- Returned external prototype work becomes auditable before integration review.
- Hosted and closed-local deployments keep the same safety posture.
- Phaser or other premium game surfaces remain possible, but must prove wrapper, event, audio, scoring, accessibility, and white-label conformance.
- Future live prototype upload or return workflows can build on a reviewed storage boundary.
