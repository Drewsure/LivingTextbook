# ADR-0498: Release Runtime Boundary

Status: Accepted

## Decision

Add a provider-neutral release runtime request/result contract and review-only adapter in the shared content model.

## Required checks

The runtime validates tenant/package/release scope, source extraction, asset rights, target-language audio, curated pathways, package runtime approval, verifier evidence, content review, teacher approval, school policy, persistence, rollback, and explicit requested state before activation.

## Guardrails

- Review-only execution always returns `sideEffect: "none"`.
- QR mutation and student-facing activation require an explicit active-release request.
- Rollback remains a reviewed state and requires rollback readiness evidence.
- Hosted managed, local classroom, and hybrid release providers must use the same runtime contract.

## Verification

Run `npm run verify:release-runtime`, typecheck, production build, and foundation verification.
