# DR-397: Local Bundle Activity Hub Fallbacks

Date: 2026-08-11

Status: Accepted

## Decision

Include curated activity hub fallback routes in local companion bundle manifests.

## Rationale

Closed textbook companion packages need the same reviewed student route pathway as the hosted PWA. A local package that only knows the front door and individual games risks losing the teacher-approved activity map when offline or closed deployments are prepared.

## Impact

- Local bundle route summaries now support `activity-hub` targets.
- MiniStar and sample publisher planning manifests include front-door, launch, activity hub, and media playlist fallback routes.
- Dedicated flashcard and Memory Match local game paths now point to their dedicated routes.
- Local bundle verification requires the activity hub fallback paths.

## Constraints

- Local bundle manifests remain planning previews, not offline-ready packages.
- Activity hub fallback routes do not unlock mastery.
- Media fallbacks remain support-only.
- Local/closed package handoff remains blocked until media rights, checksums, installer/update, reporting, QR/deep-link, and school policy gates pass.

## Verification

- `npm.cmd run verify:local-bundle`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
