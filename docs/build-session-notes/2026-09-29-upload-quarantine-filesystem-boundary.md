# Build Session: Upload Quarantine Filesystem Boundary

## Goal

Keep publisher and teacher upload intake inside its reviewed filesystem
quarantine before any later scanning, extraction, or promotion work exists.

## Implemented

- Added realpath-aware quarantine path validation.
- Applied it to upload writes, metadata reads, and payload-presence checks.
- Added missing-root, traversal, outside-path, and junction-escape coverage.
- Preserved tenant authorization, checksum, MIME, rights, scan, review-only,
  raw-payload exclusion, and promotion-blocked behavior.

## Verification

`node scripts/verify-upload-quarantine-filesystem-boundary.mjs`

`npm run verify:upload-quarantine-intake`

`npm run verify:upload-quarantine-review`
