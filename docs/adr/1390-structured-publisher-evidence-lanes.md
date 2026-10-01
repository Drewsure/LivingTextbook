# ADR 1390: Structured Publisher Evidence Lanes At Intake

## Status

Accepted for review-only pilot architecture.

## Decision

Publisher pilot intake briefs must declare rights, accessibility/caption, and
scan evidence files using safe relative paths and explicit `appliesTo`
identities. The intake-kit generator creates an evidence folder and the
no-write preflight inventories those files with source and media files.

## Why

The earlier kit described evidence requirements in prose. That made it
possible for a handoff to look structurally complete while omitting the files
that reviewers need to inspect. Structured declarations make the missing work
visible before quarantine without pretending that a declaration is approval.

## Boundaries

The evidence lanes are metadata and inventory only. They do not validate
publisher rights, accessibility, scan quality, package review, release,
promotion, QR printing, persistence, or student use. Those gates remain
independent and fail closed.

## Verification

- `node scripts/verify-publisher-pilot-intake-kit.mjs`
- `node scripts/publisher-pilot-intake-preflight.mjs --self-test`
- `node scripts/verify-publisher-pilot-submission-adapter.mjs`
