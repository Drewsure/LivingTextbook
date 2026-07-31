# ADR 0315: AI Prototype Return Review Gate

Date: 2026-07-31

## Status

Accepted.

## Context

The platform can delegate isolated prototype work to Z.ai or other outside builders. Those returned prototypes may include useful logic, Phaser surfaces, fixtures, event logs, or README notes, but they also create risk if returned code is treated as production-ready.

The platform needs a visible gate for returned prototype evidence before any code, route, scoring, audio, assignment, or package workflow can be affected.

## Decision

Add review-only `ai_prototype_return_review` panels to teacher generator routes. A returned prototype must show its source build brief, returned artifacts, required evidence, parent-engine wrapper review, JSON fixture conformance, standard event replay, audio cue coverage, deterministic scoring review, mobile accessibility review, white-label fit, and blocked actions.

Returned prototypes cannot merge into production, write route registry entries, mutate scoring profiles, mutate audio manifests, create assignments, or create student-facing previews. Phaser returns must prove they can wrap the LivingTextbook parent-engine, JSON, audio, scoring, and event contracts.

## Consequences

- Z.ai output has a safe landing zone without becoming a live app change.
- Codex keeps integration authority over architecture, events, audio, scoring, accessibility, and white-label fit.
- Phaser remains useful for premium surfaces, but never bypasses the platform contract.
- Future upload/return workflows can add storage only after this review shape is accepted.
