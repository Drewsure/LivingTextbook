# ADR-1226: Controlled Publisher Quarantine Intake

- Status: Accepted
- Date: 2026-09-29
- Scope: White-label publisher pilot intake

## Context

The pilot needs a credible path for a publisher or teacher to provide textbook
source files and multimedia assets. The repository already has a tenant-scoped
quarantine API and custody policy, but the teacher workspace was still entirely
review-only. A production-shaped pilot needs a controlled intake surface while
preserving the stronger boundary that an uploaded file is not automatically a
curriculum package, game, playlist, QR target, or student asset.

## Decision

Add a tenant-scoped teacher intake panel behind the explicit server flag
`LIVING_TEXTBOOOK_REVIEW_UPLOADS_ENABLED=true`. The default route remains
input-free. When enabled with a provisioned quarantine custody root, the panel
accepts one supported file, selected channel, and optional unit key, then calls
the existing quarantine intake endpoint. It displays only safe metadata and
keeps extraction, review approval, promotion, route mutation, assignment, and
student use blocked.

## Consequences

- The first saleable pilot can demonstrate a real publisher intake boundary.
- The default review rehearsal remains safe and deterministic.
- Operators must provision the quarantine root and explicitly enable intake.
- A later package-writer decision is still required before files can become
  reviewed unit packages or QR-linked student experiences.

## Verification

Run `npm run verify:upload-quarantine-intake`,
`npm run verify:upload-channels`, `npm run verify:upload-quarantine-review`,
`npm run verify:upload-quarantine-admission`, and
`npm run verify:routes:preview`.
