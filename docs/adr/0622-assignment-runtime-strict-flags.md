# ADR-0622: Assignment Runtime Strict Flags

Status: Accepted

## Decision

The assignment runtime boundary must validate classroom approval, policy,
progression, activation, and write fields as actual booleans.

## Required behavior

- Teacher, package, launch, private-link policy, roster, persistence,
  reporting, target-language audio, support-language, media-only, student-use,
  private-link, and assignment-write fields must be booleans.
- Stringified values must produce deterministic validation errors and must not
  control classroom access, roster, progress, or write branches.
- Support-language and media-only progress remain disabled.

## Guardrails

This is a review-only boundary. It does not activate assignments, private links,
rosters, progress streams, reports, or Z.ai/game integration.

## Verification

Run `npm run verify:assignment-runtime`,
`npm run verify:runtime-behavior`, and `npm run verify:foundation`.
