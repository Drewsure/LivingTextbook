# DR-229: Teacher Upload Workspace Route

## Decision

Use a dedicated teacher upload workspace route at `/teacher/uploads/sample-publisher` for upload intake, review, promotion, Labelled Diagram image, and multimedia asset readiness.

## Why

The platform needs upload abilities for PDFs, text, images, audio, music, video, game assets, media playlists, and local bundles, but live upload controls must not appear inside authoring or media screens before storage, rights, review, safety, and release gates exist.

## Rules

- Uploads remain intake records first.
- No live file picker is enabled in the foundation scaffold.
- No uploaded file becomes student-facing from this route.
- No PDF/text upload automatically publishes games.
- No Labelled Diagram image becomes active without asset manifest, label anchors, alt text, rights, and audio coverage.
- No music, video, or support media can trigger mastery progress.

## Follow-Up

When storage is selected, build upload intake persistence, scan/file policy, rights evidence, reviewer identity, and audit records before any real file picker or upload processor.
