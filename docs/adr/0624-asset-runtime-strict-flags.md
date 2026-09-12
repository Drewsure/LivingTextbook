# ADR-0624: Asset Runtime Strict Flags

Status: Accepted

## Decision

The asset runtime boundary must validate storage, size, mapping, release, learner-media,
and student-facing-use fields as actual booleans.

## Required behavior

- Asset policy, mapping, release, storage, size-budget, learner-media, learner-upload,
  and student-facing-use fields must be booleans.
- Stringified values must produce deterministic validation errors and must not control
  upload, promotion, binding, export, or learner-media branches.
- Unknown rights, unreviewed source records, learner uploads, and learner-recorded media
  remain blocked by the existing policy boundary.

## Guardrails

This is a review-only boundary. It does not upload files, transcode media, write local
bundles or hosted objects, mutate QR or playlist manifests, or enable Z.ai/game integration.

## Verification

Run `npm run verify:asset-runtime`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation`.
