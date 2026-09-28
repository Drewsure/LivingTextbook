# ADR 1223: Upload Quarantine Filesystem Boundary

**Status:** Accepted  
**Date:** 2026-09-29

## Context

Teacher and publisher uploads are intentionally admitted only into a review
quarantine. The quarantine store already validates tenant identities,
filenames, checksums, MIME types, and promotion state, but lexical path checks
alone cannot protect the filesystem if a tenant directory, record directory,
or payload path is a junction or symlink.

## Decision

Quarantine writes and metadata-only reads must resolve the filesystem boundary
against the configured quarantine root. The root must exist as a directory
before access is allowed; existing ancestors and artifacts must resolve inside
that root. Escapes are withheld before upload metadata is written, read, or
reported. Payload bytes remain unavailable to review responses and promotion
remains blocked.

## Consequences

- A publisher deployment must provision the quarantine root before upload
  access is enabled.
- Junction and symlink escapes fail closed without changing the review-only
  upload contract.
- The focused verifier may skip only junction creation where the host forbids
  it; ordinary root, traversal, and containment checks remain mandatory.
- This does not authorize extraction, scanning approval, student delivery,
  media publishing, or tenant-library promotion.

## Verification

Run `node scripts/verify-upload-quarantine-filesystem-boundary.mjs`,
`npm run verify:upload-quarantine-intake`, and
`npm run verify:foundation-composition`.
