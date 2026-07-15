# DR-235: Labelled Diagram Asset Workspace Route

## Decision

Add a teacher-only Labelled Diagram asset workspace route for reviewed image candidates.

## Rationale

The upload foundation needs a visible destination for image assets before live upload or game editing exists. A dedicated route lets us review manifest requirements, label anchors, target-language audio, support-language limits, and release blockers without creating a student-facing game.

## Implications

- `/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram` is active scaffold only.
- The route shows `game_asset_manifest`, `label_anchor_record`, `target_mapping_packet`, and required review packets.
- Live label editing, coordinate editing, image upload, student-facing gameplay, and assignment routes from uploaded images remain blocked.
- Active route verification now covers 43 routes.

## Next

Only build a live Labelled Diagram editor after upload storage, asset manifest storage, label anchor storage, audio coverage, accessibility review, and release-control policy are implemented.
