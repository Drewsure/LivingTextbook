# ADR-0494: Content Package Runtime Boundary

Status: Accepted

## Decision

Add a provider-neutral content-package runtime request/result contract and review-only adapter in the shared content model.

## Required checks

The runtime validates tenant and package identity, declared target language, shared package validation, target-language audio coverage, assist-language script/review rules, curated pathway review, storage policy, persistence readiness, content review, and teacher or tenant release approval.

## Guardrails

- Review-only execution always returns `sideEffect: "none"`.
- Student-facing use and QR activation cannot proceed without approved content review, target-language audio, curated pathways, storage/persistence evidence, and release approval.
- Assist language remains support-only and cannot unlock progression, mastery, rewards, or activation.
- Package writers, assignment services, route/playlist publishers, QR activators, and local companion providers must use the same runtime contract.

## Verification

Run `npm run verify:content-package-runtime`, typecheck, production build, and foundation verification.
