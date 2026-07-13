# 2026-07-14: Labelled Diagram Asset Storage Contract

## Summary

Added backend-neutral storage contracts for Labelled Diagram image assets and label anchors.

## Why

The upload channel foundation must support images, audio, video, music, PDFs, and local textbook packages without allowing raw uploaded files to become student-facing game content. Labelled Diagram is the first concrete image-game asset path, so it needs a durable storage contract before live editor work.

## Build Notes

- Added `game-asset-manifest` and `label-anchor-record` persistence categories.
- Added hosted and local write intents for game asset manifests and label anchors.
- Added backend schema entities for `game_asset_manifest` and `label_anchor_record`.
- Added migration candidates and specs for game asset manifests and label anchor records.
- Updated upload readiness documentation and backend storage verification.
- Kept live uploads, image storage, coordinate editing, label editing, and student-facing Labelled Diagram routes deferred.

## Verification

- `node --check scripts\verify-backend-storage-readiness.mjs`
- `npm run verify:backend-storage`
- `npm run verify:foundation`
