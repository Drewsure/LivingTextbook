# DR-1223: Upload Quarantine Filesystem Boundary

Date: 2026-09-29  
Status: Accepted

Upload quarantine writes and metadata-only reads now use realpath-aware
filesystem containment in addition to lexical path checks. Missing roots,
non-directory roots, traversal, and junction or symlink escapes fail closed.
The quarantine remains review-only, raw-payload response-free, and
promotion-blocked.

Evidence: `apps/web/src/server/uploads/quarantinePathPolicy.ts`,
`apps/web/src/server/uploads/quarantineUploadStore.ts`, and
`scripts/verify-upload-quarantine-filesystem-boundary.mjs`.
