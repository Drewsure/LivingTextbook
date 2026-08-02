# DR-341: AI Generator Responsibility Matrix

## Decision

Add a review-only AI generator responsibility matrix to `/teacher/generator/[tenantId]`.

## Why

The white-label platform needs to use outside AI prototype help without losing architecture, safety, and integration control. Teachers, Codex, outside AI builders/Z.ai, the verifier layer, and platform admins need separate visible duties before generated games can move toward a real package.

## Guardrails

- Codex owns architecture, schema discipline, parent-engine integration, app review, route safety, scoring authority, and final integration.
- Outside AI builders/Z.ai may create isolated prototypes only from strict briefs.
- Outside prototypes cannot write app files, create routes, mutate scoring, write rewards, create playlists, assemble packages, or assign students.
- Teachers approve classroom fit and evidence, but cannot directly publish generated content to students.
- The verifier checks generated payloads but cannot publish or assign.
- Platform admins control API cost entitlement, storage, release-control, and premium feature boundaries.

## Verification

- `scripts/verify-ai-game-generator.mjs`
- `scripts/verify-active-routes.mjs`
- `npm run verify:foundation`
