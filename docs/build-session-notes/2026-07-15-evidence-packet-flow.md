# 2026-07-15 Evidence Packet Flow

## Build Slice

Added a shared review-only evidence packet flow for upload, Labelled Diagram asset, and media asset workspaces.

## Why

The platform needs upload/media/image workflows, but real controls must wait until evidence is preserved. The new flow makes source lineage, rights proof, scan policy, target mapping, review decisions, game asset manifests, label anchors, audio coverage, accessibility, media manifests, captions/fallbacks, background media policy, checksums, and release control visible before live storage or promotion work.

## Guardrails

- No live upload button.
- No upload progress bar.
- No approve or publish action.
- No object storage write.
- No local folder activation.
- No live label or coordinate editor.
- No live media upload or transcoding.
- No playlist creation from uploaded media.
- No assignment route from uploaded files, images, or media.

## Verification

`npm run verify:upload-channels` and `npm run verify:foundation` must confirm the evidence packet flow stays visible on the three dedicated review workspaces.
