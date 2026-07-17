# DR-276: Upload File Policy Profile Storage Contract

Date: 2026-07-17

## Decision

Create a backend-neutral storage contract for `upload_file_policy_profile`.

## Rationale

Upload channels are essential for white-label textbook partners, especially PDF/text intake, Labelled Diagram images, audio/music, video, and local packages. Without a durable file policy profile, future upload controls could rely on UI-only rules and accidentally accept unsafe file types, oversize files, unchecked scans, unreviewed media, or direct upload-to-assignment shortcuts.

## Guardrails

- Accepted extensions and accepted MIME types must both be preserved.
- File size and media duration maximums must be policy-controlled.
- `scan_and_file_policy_packet` is required before live upload intake.
- Uploads without accepted file policy are blocked.
- Unsafe MIME types, oversize files, and unchecked file scans are blocked.
- File policy profiles do not upload, scan, transcode, promote, route, or assign files by themselves.
- Uploaded files remain blocked from student-facing use until later review and release gates pass.

## Verification

`npm run verify:upload-channels`, `npm run verify:backend-storage`, and `npm run verify:foundation` must pass after upload file policy profile changes.
