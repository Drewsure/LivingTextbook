# DR-231: Disabled Upload Intake Controls

## Decision

Show disabled upload intake controls before implementing real file pickers.

## Why

Teachers need to understand where PDF/text, image, audio/music, and video uploads will enter the system. The UI shape should be visible now, but live selection would be misleading before storage, scanning, rights evidence, reviewer identity, and audit trails exist.

## Rules

- Do not render a live file input element in the foundation preview.
- `Select file` and `Create intake record` actions stay disabled.
- Source metadata, scan policy, and target mapping are required gates.
- This preview cannot create upload records, store files, or promote files.

## Follow-Up

When persistence is ready, wire real controls to upload intake records only, not directly to game assets, media playlists, local bundles, or student-facing routes.
