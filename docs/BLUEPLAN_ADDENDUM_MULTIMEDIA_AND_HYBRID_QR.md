# Blueplan Addendum: Multimedia And Hybrid QR

Date: 2026-06-28

## Strategic Update

Living Textbook is not a games-only companion and not a media-only companion. It is a complete textbook package layer:

- textbook reference,
- curriculum payload,
- games,
- music/audio,
- video,
- playlists,
- optional unit/game background media,
- QR/front-door access,
- progression,
- teacher reporting,
- and local/closed deployment.

This is part of the initial build standard, not a later extension.

## Hybrid QR Standard

The platform standard is hybrid:

1. Stable QR registry for printed materials.
2. Optional tiny hosted redirect for long-lived external QR permanence.
3. Local app/content-package fallback for closed or offline deployments.
4. Front-door entry-code/user-code route when teacher reporting or controlled access is needed.

Printed QR codes must resolve stable identifiers. They must not point directly to local files, temporary localhost routes, or version-specific media assets.

## Multimedia Standard

Partner media should be handled as a catalog and package system, not as one-off pages.

The core model must support:

- audio assets,
- video assets,
- playlists,
- unit multimedia plans,
- rights/owner metadata,
- local/offline availability,
- media progress events,
- and optional background/support media for games.

Games remain playable without background media. Media engagement remains reportable separately from game mastery.

## First Build Implication

The first foundation slice should continue to prioritize clean routing, component structure, and game event contracts, but every new route, schema, and component boundary should remain compatible with multimedia packages and hybrid QR access from the start.

References:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/DECISION_REGISTER.md` DR-007 and DR-008
- `docs/adr/0004-permanent-qr-and-local-companion-mode.md`
- `docs/adr/0005-core-multimedia-package.md`
- `docs/ROUTE_CONTRACTS.md`
- `docs/BUILD_SESSIONS.md`
