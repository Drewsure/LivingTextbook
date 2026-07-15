# DR-230: Upload File Policy Profiles

## Decision

Use explicit upload file policy profiles before live uploads.

## Why

Teachers and publishers will need to upload source PDFs, images, audio, music, videos, and local-bundle assets. Without a policy profile layer, live upload controls would have unclear rules for file type, size, duration, checksums, scanning, rights, captions, alt text, or target promotion.

## Rules

- No live file picker writes until upload intake persistence and scan policy exist.
- Every file needs source lineage, MIME/extension validation, checksum capture, and virus/malware scan status.
- No upload promotion is allowed without file policy acceptance.
- No uploaded file becomes student-facing until package release gates pass.

## Follow-Up

When real storage begins, implement `scan_and_file_policy_packet` first, then connect file pickers to upload intake records, not directly to draft packages, game assets, playlists, or local bundles.
