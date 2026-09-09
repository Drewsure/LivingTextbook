# ADR-0519: Media Asset Metadata Integrity

Status: Accepted

## Context

The platform must eventually accept tenant-owned images, audio, video, posters, transcripts, and game-background media. Upload and storage are intentionally not live yet, but malformed asset records would weaken every review and future provider boundary.

## Decision

Validate media asset identity, title, kind/type compatibility, and optional duration in the shared content model before package review or future upload promotion.

## Consequences

- Asset records are usable by playlists, labelled diagrams, game modes, teacher previews, and local-bundle planning.
- Rights, scans, checksums, storage, release, and learner-data policy remain separate gates.
- No upload, transcode, provider, storage, or student-facing side effect is introduced.
