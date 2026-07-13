# ADR 0194: Upload Review Queue Preview

Date: 2026-07-13

## Status

Accepted

## Context

Upload channels and upload intake storage contracts now exist, but live file handling still needs a visible review boundary. Teachers and admins must see how uploaded PDFs, images, audio/music, and video move through review without implying that uploads can immediately become games, playlists, local bundles, or assignments.

## Decision

Add an upload review queue preview to `/teacher/intake`.

The queue shows required packets, source lineage, blocked shortcuts, disabled reviewer decision options, and next-step guidance for PDF/text, Labelled Diagram image, audio/music, and video uploads.

## Consequences

Future upload work must pass through a review queue contract before live approval, OCR promotion, asset promotion, media playlist promotion, local-bundle promotion, or student-facing assignment is implemented.

The preview keeps the product direction clear for white-label tenants while protecting the platform from accidental direct PDF-to-game publishing or unreviewed uploaded media use.
