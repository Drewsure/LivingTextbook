# Build Session Note: Local Companion Active Game Coverage

Date: 2026-08-31

## What Changed

- Tightened local companion game entries to use shared `GameModeId` and `ParentEngine` ids.
- Replaced local-only engine aliases with shared parent-engine ids.
- Added missing MiniStar local route coverage for Quiz, True or False, Balloon Pop, Sentence Builder, and Speak It.
- Added missing sample publisher local route coverage for Balloon Pop.
- Extended local bundle and active route verification to protect the fuller active game surface.

## Why It Matters

This directly supports the white-label textbook companion strategy. A partner who needs a closed local package must get a reliable manifest of content, media, routes, games, audio coverage, and reporting behavior before any installer or offline export work begins.

## Blocked Actions

- No local package export.
- No offline-ready status.
- No media file copy.
- No retained student report storage.

## Verification

- Run `npm run verify:local-bundle`.
- Run `npm run typecheck --workspace @living-textbook/web`.
- Run `npm run build --workspace @living-textbook/web`.
- Run `npm run verify:routes`.
