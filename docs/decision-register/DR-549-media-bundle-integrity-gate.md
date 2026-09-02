# DR-549: Media Bundle Integrity Gate

Status: Accepted

Date: 2026-09-03

## Decision

Add a review-only media bundle integrity gate to teacher intake and local companion preview routes.

## Rationale

White-label textbook partners may need to package and maintain videos, music, audio, posters, images, and future game assets every year. The platform must make size, checksum, rights, deduplication, fallback, replacement, and learning-audio priority visible before any offline/local package workflow exists.

## Guardrails

- No package-size approval.
- No checksum-free bundle.
- No direct folder activation.
- No uncompressed video handoff.
- No media-only progress.
- No background music overriding learning audio.
- No offline-ready claim.
- No local installer export.

## Verification

- `npm.cmd run verify:local-bundle`
- `npm.cmd run verify:routes`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
