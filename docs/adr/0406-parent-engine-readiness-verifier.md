# ADR-0406: Parent Engine Readiness Verifier

Date: 2026-08-21

## Status

Accepted.

## Context

The active game catalog and parent engine readiness panel now jointly define whether the product is ready to accept more game work. Without automated coverage, a future mode could be added to the catalog but forgotten in the parent-engine readiness gate.

## Decision

Extend the existing game mode coverage verifier to validate parent engine readiness coverage and guardrail text.

## Consequences

- Positive: New game modes must declare both catalog metadata and parent-engine readiness placement.
- Positive: Future Z.ai/Phaser intake stays gated by verifiable text and mode-to-engine mapping.
- Positive: Narrative remains visible as blocked until its dedicated state, privacy, persistence, and cost controls exist.
- Constraint: Any intentional exception must update the verifier and decision register together.

## Verification

See `docs/decision-register/DR-477-parent-engine-readiness-verifier.md`.
