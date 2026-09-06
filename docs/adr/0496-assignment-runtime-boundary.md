# ADR-0496: Assignment Runtime Boundary

Status: Accepted

## Decision

Add a provider-neutral assignment runtime request/result contract and review-only adapter in the shared content model.

## Required checks

The runtime validates tenant and assignment scope, teacher role, package and launch approval, private-link policy, roster policy, persistence, reporting, target-language audio, assignment readiness, and access-code/QR rules before activation.

## Guardrails

- Review-only execution always returns `sideEffect: "none"`.
- Student-facing use requires `ready-for-pilot` assignment readiness.
- Support-language and media-only progress remain disabled.
- Hosted managed, local classroom, and hybrid assignment providers must use the same runtime contract.

## Verification

Run `npm run verify:assignment-runtime`, typecheck, production build, and foundation verification.
