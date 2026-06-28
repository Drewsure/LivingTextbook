# ADR 0005: Core Multimedia Package

Status: Accepted

Date: 2026-06-28

## Context

White-label textbook partners may maintain music, audio, video, and games year after year as part of the same textbook product. These assets are not separate marketing extras. They are part of the total Living Textbook package.

A partner may need:

- unit songs or chants,
- listening tracks,
- lesson videos,
- music videos,
- teacher preview media,
- student playback media,
- game-linked media,
- optional background music or video during unit games,
- local/offline content bundles,
- and teacher reporting on both game and media engagement.

## Decision

Multimedia is a core content-package layer from the first build.

The platform must support audio, video, playlists, media metadata, media rights information, local/offline availability, and optional unit/game background media as reusable white-label primitives.

## White-Label Impact

Strongly positive.

This lets Living Textbook serve MiniStar, textbook publishers, schools, and other curriculum owners without separate one-off media portals.

## Cost Impact

Positive if the media layer remains data-driven.

A shared catalog and playback contract avoids later rework and prevents each tenant from needing custom music pages, video pages, and game-specific media hacks.

## Required Direction

- Content packages can include `mediaAssets`, `playlists`, and `multimediaPlans`.
- Media assets support audio and video.
- Media assets track title, type, rights, owner, duration, language, source, local bundle path, poster/transcript references, and textbook references.
- Unit multimedia plans can define primary playlists and optional background media for games.
- Background media must be optional and controllable by teacher, tenant, or accessibility settings.
- Media engagement emits standard progress events separate from game completion.

## Constraints

- Do not build one-off music or video pages as the foundation.
- Do not make background media required for gameplay.
- Do not auto-play media in a way that violates classroom expectations, device policies, browser restrictions, or accessibility needs.
- Do not store partner media without rights/owner metadata.
- Do not merge media progress and language-game mastery into one opaque score.

## Consequences

The first vertical slice and future partner pilots must think in terms of a complete living unit: textbook reference, learning payload, games, media assets, QR routes, progression, and teacher reporting.
