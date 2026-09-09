# ADR-0521: Playlist And Multimedia Relation Integrity

Status: Accepted

## Context

Living Textbook packages describe audio, video, playlists, and optional game-background media before a storage or playback provider is selected. These records are already used as evidence for teacher review, tenant isolation, local fallback planning, and future game integration. A playlist with no usable media, repeated media IDs, or an unnamed record is not a reliable content pathway. Multiple multimedia plans for one unit can also create competing policy, and a default-enabled background flag without an asset is contradictory.

## Decision

The shared content validator will require a structurally usable and unambiguous playlist or multimedia plan:

- Playlist IDs and titles must be non-empty.
- Every playlist must contain at least one media asset.
- A playlist must not repeat a media asset ID.
- A content package may contain at most one multimedia plan per unit.
- Background media cannot be enabled by default unless a background asset is declared.

## Consequences

Draft packages can still be repaired before review, but invalid media relations are visible early. The validator remains pure and provider-neutral. Storage, upload, playback, release, QR, offline, and student-use behavior remain blocked by their existing gates.

