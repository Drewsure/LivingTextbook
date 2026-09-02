# ADR 0478: Media Bundle Integrity Gate

Status: Accepted

Date: 2026-09-03

## Context

The Living Textbook product must support media-rich textbook companions with audio, music, videos, posters, images, and future game assets. This is especially important for white-label publishers who will maintain yearly textbook editions.

Media upload and local packaging are risky without bundle size budgets, checksums, duplicate detection, rights proof, fallback plans, and replacement rules.

## Decision

Add a review-only media bundle integrity gate to:

- `/teacher/intake`
- `/local/ministar`
- `/local/sample-publisher`

The gate shows:

- Media bundle integrity readiness
- Media package engineering gate
- Bundle size budget
- Checksum manifest
- Duplicate media detection
- Streaming/local fallback
- Yearly edition replacement
- Learning audio priority preserved
- Asset rights proof first

## Guardrails

- No package-size approval, checksum-free bundle, direct folder activation, uncompressed video handoff, media-only progress, background music override, offline-ready claim, or local installer export.
- Every distributed media file requires checksum and versioned manifest evidence before closed-package handoff.
- Large media needs per-unit and per-edition budget review.
- Shared assets should use tenant media library references rather than repeated local copies where appropriate.
- Learning audio must stay audible and target-language governed before music, video, or background media is allowed.

## Verification

- `npm.cmd run verify:local-bundle`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
