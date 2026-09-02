# ADR 0476: PWA And Offline Readiness Gate

Status: Accepted

Date: 2026-09-03

## Context

The platform needs to support a hosted PWA pilot path and a future closed local textbook companion path. A manifest already gives the app an installable identity, but installability does not prove offline lessons, media playback, reporting, QR fallback, or local privacy behavior.

Without a visible gate, future builders could accidentally imply that local preview routes, package manifests, or demo media are offline-ready.

## Decision

Add a review-only PWA and offline readiness gate to `/teacher/intake`.

The gate shows:

- PWA and offline readiness
- Installable shell
- Manifest available
- Service worker not enabled yet
- Cache strategy not approved yet
- Offline media bundle not approved yet
- Rights and versioned manifest required
- Learning audio priority preserved
- Local companion fallback required
- QR alias compatibility required
- No offline-ready claim
- No service worker registration
- No cache mutation
- No media pre-cache
- No local installer export
- No student data offline storage
- No background sync

## Guardrails

- The gate is informational and cannot register a service worker, mutate caches, copy media, export an installer, store learner data, run background sync, mutate QR redirects, or activate a local package.
- Offline media bundles require rights proof, checksums, package size review, tenant approval, and learning-audio priority before any local/offline use.
- Closed local companion behavior must remain tied to edition-aware QR fallback, rollback, persistence, report export, learner-data exclusions, and school policy acceptance.
- Hosted PWA should remain the first pilot path for cost control until local companion requirements are proven.

## Verification

- `npm.cmd run verify:local-bundle`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
