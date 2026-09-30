# Build Session: Approved Asset Promotion Custody

Implemented the first real publisher-byte promotion boundary.

- Added a shared request/record contract for image, audio, video, and source-document promotion.
- Added exact tenant/package/version, release receipt, reviewed evidence, channel, MIME, unit, checksum, and destination-path validation.
- Added a server-side promotion writer with an explicit disabled-by-default gate, checksum re-verification, atomic per-file copy, immutable custody record, idempotent replay, and conflict handling.
- Added the controlled delivery route. It reads existing release lineage and delivery custody before the writer can run.
- Added deployment-preflight visibility for the promotion gate.
- Added behavior verification covering disabled writes, safe paths, evidence binding, checksum-verified copying, replay, and student-facing separation.

Package assembly has not yet been changed to consume the new package-scoped approved root. That is intentionally the next integration slice; this session establishes the custody boundary first.

