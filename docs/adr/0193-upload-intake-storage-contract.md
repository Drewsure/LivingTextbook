# ADR 0193: Upload Intake Storage Contract

Date: 2026-07-13

## Status

Accepted

## Context

Upload channel readiness is now visible on teacher intake. Future live upload controls need durable metadata and policy records before files can feed source drafts, Labelled Diagram images, audio/music playlists, video playlists, or local bundles.

## Decision

Add `upload-intake` / `upload_intake_asset` as a backend-neutral storage category.

The contract preserves upload source lineage, file metadata, rights status, scan status, target mapping, and review status. It blocks student-facing uploaded file use until file policy, rights, review, route mapping, audio coverage, and release gates pass.

## Consequences

Future hosted and local implementations can add file pickers, object storage, local upload folders, OCR, image label anchors, and media processing without letting uploaded files become student-facing by default.
