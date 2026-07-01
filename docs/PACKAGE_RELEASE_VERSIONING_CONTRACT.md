# Package Release Versioning Contract

Document type: foundation product/data contract  
Status: active scaffold  
Last updated: 2026-07-01

## Purpose

Textbook partners must be able to maintain units, games, music, videos, playlists, and media files year after year without breaking printed QR codes or student routes.

The package release contract defines the review and versioning surface before backend persistence is chosen.

## Current Route

Review at:

- `http://127.0.0.1:3000/teacher/intake`

## Current Code

- `apps/web/src/data/sampleContentIntakePlan.ts`
- `apps/web/src/features/content-intake/ContentIntakeReviewPanel.tsx`
- `apps/web/src/app/teacher/intake/page.tsx`

## Release Record Shape

The scaffolded `ContentPackageRelease` record includes:

- release id,
- package id,
- tenant name,
- edition,
- version,
- release status,
- stable route path,
- active-for-QR flag,
- unit count,
- media asset count,
- game-mode count,
- changes since previous version,
- release gate notes.

## Release Rules

- Stable front-door routes should survive yearly content updates.
- Printed QR codes should resolve to stable route or registry IDs, not raw package files.
- New textbook editions should create new reviewed package releases.
- Media changes must keep rights, ownership, local bundle, and hosted storage metadata visible.
- Game-mode changes must remain data-driven and should not fork tenant-specific app screens.
- Teacher approval remains required before a new release becomes student-facing.
- A release can be shown as a scaffold without being production-active.

## White-Label Value

This contract is important for saleability. A school or publisher does not only need a demo unit; they need a practical maintenance path for future editions, updated audio/video, revised games, new QR targets, and teacher approval.

## Non-Goals

- This scaffold does not publish real releases.
- This scaffold does not migrate media files.
- This scaffold does not choose hosted storage or local bundle format.
- This scaffold does not make raw PDF extraction student-ready.
