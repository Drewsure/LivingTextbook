# ADR 0635: Phaser Candidate Wrapper Order

**Status:** Accepted for controlled prototype review  
**Date:** 2026-09-12

## Context

The frozen MiniStar snapshot contains a substantial Phaser suite. The first candidates are Memory Match and Balloon Pop. The platform must benefit from that work without allowing scene-owned scoring, browser persistence, fixed English speech, direct telemetry, or random rewards to become white-label platform behavior.

## Decision

Review and wrap Memory Match first, then Balloon Pop. Keep both source scenes outside the production application until the adapter, event, audio, scoring, persistence, identity, and replay contracts are verified.

## Rationale

Memory Match has a more bounded interaction model and a clearer answer boundary. It is therefore the better first candidate for proving that a Phaser scene can operate under platform-owned contracts. Balloon Pop remains a high-value second candidate because it tests timing, movement, miss semantics, reduced motion, and touch ergonomics.

## Consequences

- We gain a repeatable Phaser integration pattern before reviewing the more timing-sensitive arcade mode.
- The first wrapper work must include contract translation rather than visual polishing.
- Direct copy/paste of `BaseEngine` behavior is explicitly out of scope.
- Z.ai source remains a review input, not an authority over Living Textbook scoring, audio, identity, or rewards.

## Revisit trigger

Revisit this order if the review packet shows Memory Match cannot meet the accessibility or deterministic replay contract without a larger rewrite than Balloon Pop, or if teacher pilot evidence identifies Balloon Pop as the required first pathway.
