# ADR 1229: Quarantine Review Decision Record

Date: 2026-09-29  
Status: Accepted

## Decision

The local pilot may record one immutable, tenant-scoped teacher review decision
beside a quarantined intake record when the operator explicitly enables
`LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED=true`.

The record is metadata-only and has two outcomes: accepted for package review,
or changes required. It is not a release approval. It cannot write evidence
attachments, select storage, assemble package JSON, promote an upload, create a
route, playlist, game, assignment, or QR alias, or permit student use.

## Rationale

This gives a saleable local pilot a real human review checkpoint while keeping
the later hosted evidence adapter and release-control decision explicit. The
record is immutable and idempotent so a second decision cannot silently replace
the first review history.

## Verification

Run `node scripts/verify-upload-quarantine-review-decision.mjs`, the quarantine
admission gate, and the full `npm run verify:foundation` gate after changes.
