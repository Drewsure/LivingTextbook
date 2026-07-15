# ADR 0233: Upload Target Mapping Preview

## Status

Accepted.

## Context

Upload intake and file policy are not enough. A reviewed file still needs a controlled target map before it can become a draft package, Labelled Diagram asset, media playlist binding, background-media policy, or local bundle entry. Without this map, future upload work could accidentally create routes or assignments directly from files.

## Decision

Add an upload target mapping preview to `/teacher/uploads/sample-publisher`. The map shows source channels, target records, route previews, required evidence, allowed preview actions, blocked shortcuts, and next gates.

## Consequences

- `target_mapping_packet` becomes a visible prerequisite before upload promotion.
- Uploads cannot create routes, assignments, student-facing targets, or local bundle activations directly.
- Target mapping remains preview-only and does not create draft packages, assets, playlists, local bundle entries, or routes.
