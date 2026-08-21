# ADR-0405: Parent Engine Readiness Panel

Date: 2026-08-21

## Status

Accepted.

## Context

The build has enough active game surfaces that future work could drift toward one-off game pages or premature outside prototype intake. The white-label platform needs a stable engine-led growth rule that works for DOM reference games, Phaser wrappers, AI-generated game briefs, printable conversions, and future narrative/tutor experiences.

## Decision

Add a parent engine readiness model and teacher/admin panel covering Pairing, Selection, Text-spelling, and Narrative engines.

## Consequences

- Positive: Future game decisions can be evaluated against parent-engine readiness before implementation.
- Positive: Z.ai and Phaser work can be discussed without promoting external code too early.
- Positive: Narrative and AI Tutor work stay visibly blocked until privacy, persistence, state, and cost gates exist.
- Constraint: New modes must map to a parent engine and pass standard event, scoring, audio, route, and settings gates before becoming active.

## Verification

See `docs/decision-register/DR-476-parent-engine-readiness-panel.md`.
