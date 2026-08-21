# ADR-0404: Playable Demo Flow Prop Contract

Date: 2026-08-21

## Status

Accepted.

## Context

The active non-entry playable routes now share the same route shell. Their route-level props should also stay aligned so future game wrappers can enter through one predictable contract.

## Decision

Add `PlayableGameDemoFlowProps` beside `PlayableGameRouteShell` and use it in active non-entry demo flows.

## Consequences

- Positive: Future active game routes can start from a shared typed contract.
- Positive: Parent-engine game components remain isolated from route-level page scaffolding.
- Positive: Flashcard entry remains separate for justified onboarding reasons.
- Constraint: A new route needing extra props must document why it cannot use the shared type.

## Verification

See `docs/decision-register/DR-475-playable-demo-flow-prop-contract.md`.
