# DR-198: Labelled Diagram Asset Readiness Preview

## Decision

Add a read-only Labelled Diagram asset readiness preview for reviewed image uploads.

## Rationale

Labelled Diagram is the first concrete game-asset landing zone for uploaded images. It needs explicit `game_asset_manifest` and `label_anchor_record` concepts before live image editors, coordinate storage, or student-facing image games are built.

## Implications

- `/teacher/intake` shows Labelled Diagram asset readiness.
- Image rights, alt text, anchor coordinates, target-language label text, audio coverage, and accessibility review are required.
- Support-language labels remain support-only and cannot trigger progress.
- Student-facing image games, auto-generated labels, live label editors, and asset promotion without release gates remain blocked.

## Next

Add durable `game_asset_manifest` and `label_anchor_record` storage contracts before implementing a live Labelled Diagram editor or route.
