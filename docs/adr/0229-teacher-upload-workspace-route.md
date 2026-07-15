# ADR 0229: Teacher Upload Workspace Route

## Status

Accepted.

## Context

Upload readiness was visible on `/teacher/intake`, but upload work needs a dedicated teacher/admin route before live file pickers, object storage, local folders, OCR, image labeling, media processing, or student-facing uploaded assets are built. Without a route boundary, upload controls could become tangled with authoring, media maintenance, or assignment screens.

## Decision

Add `/teacher/uploads/sample-publisher` as a read-only upload command center. It gathers upload channel readiness, upload review queue, upload promotion readiness, Labelled Diagram asset readiness, and multimedia asset readiness in one route while keeping live upload and student-facing use blocked.

## Consequences

- Future upload controls must start from this workspace or an explicitly reviewed successor.
- The workspace proves PDF/text, image, audio, music, video, and local-bundle upload categories without storing files.
- Active route verification now checks the route for no-live-file-picker and no-student-facing-upload boundaries.
- This does not enable object storage, OCR, image label editing, media processing, local bundle placement, or live publishing.
