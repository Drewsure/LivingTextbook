# ADR 0943: Canonical Pilot Package Scope

Status: Accepted

## Context

The first partner pilot used different package identifiers in content,
release-control, approval, report, persistence, and activation previews. Each
surface could look internally valid while describing a different package.

## Decision

The pilot handoff contract uses one canonical tenant/package identity across
all scoped evidence. Human-facing handoff labels, release-candidate names,
and route slugs remain separate presentation fields. The shared validator
rejects report, persistence, release-control, and activation evidence that
does not match the handoff package.

Stable route keys are stored separately from package ids so a package identity
correction cannot silently change printed QR or teacher review URLs.

## Consequences

- Tenant isolation and release review have one unambiguous package boundary.
- A future backend can key records without guessing which package a review
  referred to.
- Existing fixtures that used a release label as a package id must be migrated
  before they can enter a real pilot.
- This remains a review-only contract; it does not activate storage, publishing,
  or classroom launch.

## Verification

- `node scripts/verify-pilot-handoff-scope.mjs`
- `node scripts/verify-runtime-behavior.mjs`
- `npm run verify:routes`
