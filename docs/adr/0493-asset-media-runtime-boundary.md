# ADR-0493: Asset And Media Runtime Boundary

Status: Accepted

## Decision

Add a provider-neutral asset/media runtime request/result contract and review-only adapter in the shared content model.

## Required checks

The runtime validates tenant scope, asset identity, kind, MIME type, size, checksum, scan status, rights, source review, target mapping, storage policy, learner-media exclusion, and release state before a provider can be considered.

## Guardrails

- Review-only execution always returns `sideEffect: "none"`.
- Core asset handling excludes learner-recorded media and learner uploads.
- Student-facing promotion requires approved source review, reviewed target mapping, accepted storage policy, and release approval.
- Hosted managed, local classroom, and hybrid providers must use the same runtime contract.

## Verification

Run `npm run verify:asset-runtime`, typecheck, production build, and foundation verification.
