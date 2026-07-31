# ADR 0319: AI Prototype Wrapper Adapter Review

Date: 2026-07-31  
Status: Accepted

## Context

The platform may receive game prototypes from Z.ai or other outside builders. Some prototypes may be Phaser-based or visually rich, but they still cannot own LivingTextbook platform authority.

Before any returned prototype can be considered for integration, the team needs a review-only adapter boundary that proves the prototype can live as a removable wrapper around an approved parent engine.

## Decision

Add an AI prototype wrapper adapter review panel and sample data to the teacher generator routes. The review must show fixture input contract, standard event output contract, state ownership rules, wrapper evidence, rejection triggers, and blocked actions.

The wrapper can own transient local interaction and animation state. It cannot own routes, scoring authority, audio manifest authority, assignment or learner identity, reward writes, tenant branding, package promotion, or student-facing release behavior.

## Consequences

- External prototype work can remain useful without becoming a direct app import.
- Phaser or premium surfaces must still emit standard events and request shared audio.
- Hard-coded tenant content, event bypass, hidden labels, support-language progress triggers, direct score/reward writes, route side effects, and assignment side effects reject the wrapper.
- The gate stays review-only until storage and integration tooling are designed.
