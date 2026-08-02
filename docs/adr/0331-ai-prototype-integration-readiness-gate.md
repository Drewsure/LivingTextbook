# ADR 0331: AI Prototype Integration Readiness Gate

## Status

Accepted

## Context

Returned prototype work from Z.ai or other outside builders now has separate review lanes for wrapper adapter fit, JSON fixture replay, standard events, target-language audio, mobile accessibility, and deterministic scoring. Those lanes are useful, but they can become fragmented unless a single gate shows whether all evidence is ready before integration.

Without a rollup gate, a visually strong Phaser or static prototype could be mistaken for an app-ready game and pushed toward `apps/web`, route registry writes, Star Dust writes, reward writes, or student assignment before the required evidence and Codex integration decision exist.

## Decision

Add a review-only AI prototype integration readiness gate to the teacher generator routes. The gate summarizes wrapper, fixture, event, audio, mobile, scoring, and Codex decision evidence before any returned prototype can propose an `apps/web` integration patch.

The gate blocks direct imports, route registry writes, student-facing routes, scoring profile mutations, Star Dust or reward writes, audio manifest mutations, package promotion, and assignment until all evidence checks are reviewed and a Codex decision is present.

## Consequences

- Outside prototype work can continue quickly while the real platform remains protected by a single integration readiness decision.
- Teachers and reviewers can see exactly which evidence packets are still missing.
- Phaser and other premium surfaces remain candidates only as removable wrappers around the LivingTextbook parent-engine contract.
- MiniStar Japanese support remains hiragana-only for early levels and support-only; English remains the target-language trigger for progress and release readiness.
