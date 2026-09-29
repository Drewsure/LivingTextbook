# ADR 1230: Publisher Pilot Package Preview

Date: 2026-09-29
Status: Accepted

## Decision

Create one tenant-scoped package preview for the first saleable white-label
pilot. The preview joins reviewed textbook content, curated game routes,
multimedia evidence, stable QR aliases, local fallback, and optional hosted
persistence into one publisher-readable package map.

## Boundaries

This is a review artifact, not a release archive. Proposed artifacts remain
write-blocked and student-facing-blocked. QR records remain draft-only or
blocked, production printing is not authorized, hosted persistence is opt-in
review-only, and provider activation, package export, promotion, and student
assignment remain blocked.

## Rationale

Publishers need to see the complete product they are buying before the platform
has permission to activate every delivery path. A single package map exposes
missing content, media rights, game/audio, QR, local deployment, reporting, and
rollback evidence without allowing a partial review surface to masquerade as a
finished package.

## Verification

`scripts/verify-publisher-pilot-package-preview.mjs` validates the shared model,
sample package, UI integration, stable QR alias requirement, and blocked
side-effect rules. The verifier is included in foundation composition.
