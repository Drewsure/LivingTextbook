# DR-1134: Quarantine Metadata Review Read Path

- Quarantine review is tenant-authorized and metadata-only.
- Review may return validated intake identity, channel, filename, MIME type,
  size, checksum, pending scan state, unknown rights, unreviewed source, and
  payload presence; it must not return raw bytes, paths, or download URLs.
- Unsafe, malformed, cross-tenant, or unreadable records are withheld and
  reported only as bounded generic review errors.
- Review cannot mutate scan, rights, source, mapping, promotion, student use,
  playlists, games, assignments, QR routes, or local bundle state.

Evidence: `packages/content-model/src/uploadQuarantineReview.ts`,
`apps/web/src/server/uploads/quarantineUploadStore.ts`,
`apps/web/src/app/api/teacher/uploads/review/route.ts`, and
`scripts/verify-upload-quarantine-review.mjs`.
