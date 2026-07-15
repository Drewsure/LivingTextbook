# ADR 0235: Labelled Diagram Asset Workspace Route

## Status

Accepted.

## Context

Image uploads need a target-specific review surface before they can become Labelled Diagram game assets. The intake and upload workspace already describe the gates, but teachers and tenant admins also need a focused route that shows the manifest, anchors, audio coverage, support-language boundary, and blocked live actions for one asset candidate.

## Decision

Add `/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram` as a teacher-only asset review workspace. The route renders a preview-only `game_asset_manifest`, `label_anchor_record`, `target_mapping_packet`, required packets, related evidence routes, and blocked live actions.

## Consequences

- The route gives uploaded images a governed landing zone before any student-facing image game exists.
- Live upload, coordinate editing, label editing, asset promotion, assignment routing, and student gameplay remain blocked.
- Active route verification grows to 43 checked routes.
