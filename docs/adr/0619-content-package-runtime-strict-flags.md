# ADR-0619: Content-Package Runtime Strict Flags

Status: Accepted

## Decision

The content-package runtime boundary must validate policy and activation flags
as actual booleans before evaluating package use or QR activation.

## Required behavior

- Curated pathway review, storage policy, persistence, teacher release,
  student-facing use, and QR activation flags must be booleans.
- Stringified values such as `"true"` and `"false"` must produce validation
  errors and must not control package-use or QR branches.
- Existing tenant, package, audio, assist-language, and review-only gates remain
  authoritative.

## Guardrails

This is a review-only runtime boundary. It does not write packages, activate QR
routes, select storage, bind assignments, or enable Z.ai/game integration.

## Verification

Run `npm run verify:content-package-runtime`,
`npm run verify:runtime-behavior`, and `npm run verify:foundation`.
