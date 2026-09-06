# ADR-0491: Persistence Runtime Boundary

Status: Accepted

## Decision

Add a provider-neutral persistence runtime request/result contract and a review-only adapter in the shared content model.

## Required checks

The runtime validates tenant scope, record identity, operation, student-data policy, raw-audio/transcript exclusion, release approval, and payload evidence before an adapter can be considered.

## Guardrails

- Review-only execution always returns `sideEffect: "none"`.
- Hosted database, local classroom, hybrid sync, export, and release-state side effects remain blocked.
- Future adapters must consume this contract rather than bypassing it through route or UI code.

## Verification

Run `node scripts/verify-persistence-runtime.mjs`, typecheck, production build, and foundation verification.
