# ADR-0027: Package Release Versioning

Status: Accepted  
Date: 2026-07-01

## Context

Living Textbook is a white-label platform, not only a MiniStar demo. Textbook partners need a reliable way to update units, games, music, videos, playlists, and media assets year after year while keeping printed QR codes and stable front-door routes working.

Without a package release concept, yearly textbook updates would either break QR codes or force one-off route and file changes.

## Decision

Add a package release/versioning scaffold to the teacher intake route. A release record tracks package id, edition, version, stable route path, QR activation state, unit count, media count, game-mode count, changes since previous version, and remaining release gates.

The package release scaffold is visible at:

- `http://127.0.0.1:3000/teacher/intake`

## Consequences

Positive:

- Gives textbook partners a clear maintenance story.
- Keeps stable QR/front-door routes separate from changing package versions.
- Makes media, rights, and teacher approval gates visible before publication.
- Preserves white-label portability by avoiding tenant-specific release screens.

Tradeoffs:

- The release data is still static sample data until persistence is selected.
- A future backend must store package releases, active QR targets, and release history durably.
- Release activation must be tied to review, media rights, teacher approval, and route registry policy before production use.

## Related Documents

- `docs/PACKAGE_RELEASE_VERSIONING_CONTRACT.md`
- `docs/verification/CONTENT_INTAKE_CHECKS.md`
