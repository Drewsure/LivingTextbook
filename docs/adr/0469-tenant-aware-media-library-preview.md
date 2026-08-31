# ADR 0469: Tenant-Aware Media Library Preview

Status: Accepted

Date: 2026-08-31

## Context

The media library preview started as a sample-publisher route, but audio, music, video, posters, playlists, background media, and local bundle media are core to both the white-label product and the flagship MiniStar school product.

MiniStar also has stricter learner-audio and Japanese support-language requirements. The route must therefore prove tenant-specific media readiness without hard-coding another tenant's branding or asset ownership language.

## Decision

Add `/teacher/media/ministar` as a read-only MiniStar media library preview and make the shared media-library route resolve the correct tenant shell before rendering.

The shared panel now displays a tenant-owned asset heading from media-library data, so MiniStar can show `MiniStar-owned assets` while the sample publisher route continues to show `Partner-owned assets`.

## Guardrails

- The media library remains review-only.
- No live upload, replacement, transcoding, storage write, playlist promotion, background-media assignment, local folder activation, report export, or student assignment is enabled.
- Target-language learner audio remains required for games and cannot be replaced by video, background music, or support-language audio.
- MiniStar Foundation/Bronze/Plus Japanese support stays hiragana-only and support-only.
- Support-language taps, media playback, and background media cannot unlock progress, mastery, scoring, rewards, routes, or release state.
- Active route and upload-channel verification must protect both MiniStar and sample-publisher media library previews.

## Verification

- `npm.cmd run verify:upload-channels`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
