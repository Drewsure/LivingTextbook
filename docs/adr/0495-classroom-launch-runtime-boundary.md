# ADR-0495: Classroom Launch Runtime Boundary

Status: Accepted

## Decision

Add a provider-neutral classroom launch runtime request/result contract and review-only adapter in the shared content model.

## Required checks

The runtime validates tenant/package/session scope, reviewed access mode, teacher role, package and assignment runtime approval, QR/front-door review, school policy, roster policy, persistence, reporting policy, target-language audio, and open-session state before student launch.

## Guardrails

- Review-only execution always returns `sideEffect: "none"`.
- Support-language and media-only progress remain disabled.
- Real learner data requires persistence and accepted roster/identity policy.
- Hosted managed, local classroom, and hybrid launch providers must use the same runtime contract.

## Verification

Run `npm run verify:launch-runtime`, typecheck, production build, and foundation verification.
