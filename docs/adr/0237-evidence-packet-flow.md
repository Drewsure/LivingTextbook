# ADR 0237: Evidence Packet Flow

## Status

Accepted.

## Context

The upload, Labelled Diagram, and media asset workspaces now show enough structure that a future build could be tempted to add real file buttons too early. That would risk bypassing source ownership, rights proof, scan policy, target mapping, audio coverage, accessibility, captions, release gates, and classroom assignment controls.

## Decision

Add a shared `Evidence packet flow` layer to the teacher-only upload, Labelled Diagram asset, and media asset workspaces. The flow shows the required packets, current missing evidence, owners, handoff rule, and blocked live actions before any real upload, storage, editor, playlist, approval, publish, or assignment action exists.

## Consequences

- Uploads remain review artifacts before they become files in storage.
- Image assets cannot become Labelled Diagram games before manifest, anchor, audio, accessibility, and release evidence exists.
- Media assets cannot become playlists, background media, or local bundle entries before manifest, captions/fallbacks, rights, checksum, learning-audio priority, and release evidence exists.
- The foundation verifier now checks evidence packet data, evidence packet UI, and route-visible evidence text.
