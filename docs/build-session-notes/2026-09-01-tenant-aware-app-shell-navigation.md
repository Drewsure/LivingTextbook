# Build Session Note: Tenant-Aware App Shell Navigation

Date: 2026-09-01

## Summary

Changed the shared app shell so tenant-scoped navigation is built from the current tenant instead of hard-coded sample-publisher paths.

## Changes

- Added route helpers for prototype review and local companion preview paths.
- Replaced the literal shared navigation block with a tenant-aware link builder.
- MiniStar shells now link to MiniStar source review, AI generator, prototype review, tenant review queue, media library, session monitor, and local preview.
- Sample publisher shells keep the deeper partner-only dry run, launch gate, library, maintenance, release, upload, evidence, asset, media asset, session monitor, and partner demo links.
- Active route verification now checks representative positive and forbidden navigation markers for MiniStar and sample publisher media-library pages.

## Guardrails Preserved

- Navigation is a review shortcut only.
- No upload, evidence export, release mutation, media replacement, local package export, route promotion, scoring, reward, assignment, or live classroom launch behavior is introduced.
- MiniStar pages must not expose sample-publisher-only operational routes.
- Sample publisher pages must not expose MiniStar-only media ownership or session links.

## Preview

- `http://127.0.0.1:3000/teacher/media/ministar`
- `http://127.0.0.1:3000/teacher/media/sample-publisher`
