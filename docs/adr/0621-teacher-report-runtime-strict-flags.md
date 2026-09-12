# ADR-0621: Teacher-Report Runtime Strict Flags

Status: Accepted

## Decision

The teacher-report runtime boundary must validate role, policy, persistence,
export, release, and raw-media exclusion fields as actual booleans.

## Required behavior

- Teacher role, policy, persistence, export, release, raw-audio, and transcript
  fields must be booleans.
- Stringified values must produce deterministic validation errors and must not
  control report evidence interpretation or export branches.
- Pseudonymous learner slots remain the only core report identity mode.

## Guardrails

This is a review-only boundary. It does not export reports, promote learner
identities, store raw audio/transcripts, or enable Z.ai/game integration.

## Verification

Run `npm run verify:report-runtime`,
`npm run verify:runtime-behavior`, and `npm run verify:foundation`.
