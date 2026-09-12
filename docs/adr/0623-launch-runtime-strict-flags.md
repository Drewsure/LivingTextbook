# ADR-0623: Launch Runtime Strict Flags

Status: Accepted

## Decision

The launch runtime boundary must validate classroom, QR, policy, learner-data,
and student-launch fields as actual booleans.

## Required behavior

- Teacher, package, assignment, QR review/readiness, fallback, school, roster,
  persistence, reporting, target-language audio, support-language, media-only,
  learner-data, and student-launch fields must be booleans.
- Stringified values must produce deterministic validation errors and must not
  control QR, front-door, classroom, or learner-data branches.
- Support-language and media-only progress remain disabled.

## Guardrails

This is a review-only boundary. It does not activate sessions, mutate QR routes,
bind rosters, collect learner data, or enable Z.ai/game integration.

## Verification

Run `npm run verify:launch-runtime`,
`npm run verify:runtime-behavior`, and `npm run verify:foundation`.
