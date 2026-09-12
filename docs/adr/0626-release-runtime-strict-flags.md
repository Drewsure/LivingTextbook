# ADR-0626: Release Runtime Strict Flags

Status: Accepted

## Decision

The release runtime boundary must validate source, asset, audio, pathway, package,
policy, persistence, rollback, QR, and student-activation fields as actual booleans.

## Required behavior

- Source extraction, asset rights, target-language audio, curated pathway, package,
  teacher, school, persistence, rollback, QR mutation, and student-facing activation
  fields must be booleans.
- Stringified values must produce deterministic validation errors and must not control
  release approval, active transitions, rollback, QR mutation, or student activation.
- Release approval remains separate from content review, verifier evidence, rights,
  persistence, and rollback readiness.

## Guardrails

This is a review-only boundary. It does not mutate release state, QR redirects,
assignments, classroom sessions, or student-facing activation, and it does not enable
Z.ai/game integration.

## Verification

Run `npm run verify:release-runtime`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation`.
