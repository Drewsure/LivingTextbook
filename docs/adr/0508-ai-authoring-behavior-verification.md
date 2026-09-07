# ADR-0508: AI Authoring Behavior Verification

Status: Accepted

## Context

The AI authoring service is intended to prepare structured draft content for teacher review. It must never become an unreviewed model-dispatch, package-publishing, or game-generation path, especially while outside prototypes remain under review.

## Decision

Extend the local compiled-contract behavior harness to compile and exercise `apps/ai-service/src/index.ts` with the shared content model.

The harness covers:

- vocabulary counts outside the 8–12 range;
- target sentence counts other than exactly two;
- missing target-language audio evidence;
- missing media-rights evidence;
- review-only result status and `providerDispatchAllowed: false`.

## Consequences

- The pedagogical lock is executable evidence rather than documentation only.
- Future provider or Z.ai prototype integration must pass the same request contract.
- The harness performs no model call, billing, source write, package write, route write, assignment activation, or learner-data collection.
