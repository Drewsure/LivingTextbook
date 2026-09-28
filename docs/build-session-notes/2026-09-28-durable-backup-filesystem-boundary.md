# Build Session: Durable Backup Filesystem Boundary

## Goal

Ensure durable backup and restore artifacts cannot escape their reviewed
custody root through a junction, symlink, or missing-root assumption.

## Implemented

- Added realpath-aware backup custody validation.
- Applied it to both backup destinations and restore sources/destinations.
- Added missing-root, existing-root, and junction-escape verification.
- Kept the existing lexical validator for pure contract checks.
- Preserved all policy, manifest, encryption, rotation, retention, approval,
  and no-execution gates.

## Verification

`node scripts/verify-durable-progression-backup-path.mjs`

`node scripts/verify-durable-progression-operations.mjs`

`npm run verify:foundation-composition`
