# ADR-0620: Persistence Runtime Strict Flags

Status: Accepted

## Decision

The persistence runtime boundary must validate privacy, school-policy, and
release fields as actual booleans before evaluating a record request.

## Required behavior

- Student-data, raw-audio, transcript, school-policy, policy-acceptance, and
  release fields must be booleans.
- Stringified values must produce deterministic validation errors and must not
  control privacy, export, or mutation branches.
- Raw learner audio and transcripts remain excluded from core persistence.

## Guardrails

This is a review-only boundary. It does not select hosted/local/hybrid storage,
write learner records, export reports, or enable Z.ai/game integration.

## Verification

Run `npm run verify:persistence-runtime`,
`npm run verify:runtime-behavior`, and `npm run verify:foundation`.
