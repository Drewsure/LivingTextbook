# ADR-0567: Derived Prototype Alert

Status: Accepted  
Date: 2026-09-12

## Decision

Derive the Z.ai/Codex prototype intake alert state from the readiness summary
through a shared content-model function. Structural evidence blockers produce a
blocked state; a ready alert requires a ready summary with every lane ready.

## Why

The alert is a human handoff signal and must not be a separate mutable truth.
Deriving it prevents a stale flag from asking the user to hand over Z.ai source
before the foundation is ready.

## Guardrails

- Preview-only records do not produce a ready alert.
- No alert state authorizes imports, route writes, scoring, rewards, package
  promotion, or assignments.

## Verification

The shared decision function is
`packages/content-model/src/prototypeIntakeAlert.ts`.
Runtime assertions are in `scripts/verify-runtime-behavior.mjs`.
