# DR-193: Upload Intake Storage Contract

## Decision

Add a durable storage contract for upload intake records.

## Rationale

Live upload controls need more than object storage. Uploads require tenant scope, uploader identity, file metadata, source lineage, rights status, scan status, target mapping, review status, and a student-facing-use block.

## Implications

- Shared content-model persistence categories include upload intake records.
- Hosted and local adapter plans include upload intake write intents.
- Backend schema, migration candidates, and migration specs include upload metadata and blocked-use state.
- Uploaded files cannot become games, media playlists, local bundle assets, or assignments by storage location alone.

## Next

Only add live file pickers, object storage, OCR, media processing, image label anchors, or local upload folders after upload intake records and file policy are accepted.
