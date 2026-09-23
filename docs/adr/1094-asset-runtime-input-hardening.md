# ADR 1094: Asset Runtime Input Hardening

## Status

Accepted.

## Decision

The shared review-only asset runtime validator must fail closed for malformed
requests before future upload, media, or source-intake adapters can use them.
It validates object shape, bounded tenant and asset identifiers, bounded unit
keys, MIME type structure, checksum size, and supported operation, asset kind,
scan, rights, and source-review values.

## Rationale

PDF, image, audio, and video intake will eventually cross a storage boundary.
TypeScript types do not protect that boundary from JSON, form, or adapter
callers at runtime. Rejecting malformed values in the shared package prevents
tenant confusion, unsupported state values, oversized metadata, and ambiguous
file-type claims from reaching later upload or promotion work.

## Guardrails

- The runtime remains review-only; no file picker, upload, copy, storage, or
  student-facing promotion is enabled.
- Placeholder checksums remain allowed for review planning, but their size and
  presence are bounded; final release checks remain separate.
- Asset rights, scan, mapping, release, learner-media, and policy gates remain
  unchanged.
- Provider and deployment choices remain outside this validator.

See `packages/content-model/src/assetRuntime.ts` and
`scripts/verify-runtime-behavior.mjs`.
