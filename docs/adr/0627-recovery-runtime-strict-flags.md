# ADR-0627: Recovery Runtime Strict Flags

Status: Accepted

## Decision

The recovery runtime boundary must validate persistence, backup, checksum, encryption,
access control, privacy, rollback, release, and local-fallback fields as actual booleans.

## Required behavior

- Persistence, backup manifest, checksum, encryption, access-control, retention,
  school-policy, report-integrity, rollback, release, raw learner-audio exclusion,
  raw learner-transcript exclusion, and local-fallback fields must be booleans.
- Stringified values must produce deterministic validation errors and must not control
  backup, restore, export, rollback, privacy, or learner-data recovery branches.
- Hosted and local recovery remain policy-separated; review-only execution remains
  side-effect free.

## Guardrails

This is a review-only boundary. It does not create backups, restore data, write export
archives, copy packages or media, mutate QR/routes, or execute release rollback.

## Verification

Run `npm run verify:recovery-runtime`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation`.
