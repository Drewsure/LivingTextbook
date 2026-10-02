# DR-1435: Durable Publisher Revision Evidence

Publisher handoff revisions now leave a create-once
`evidence/publisher-handoff-revision.json` record containing checksum-bound
metadata for copied, missing, omitted, and excluded paths. It preserves the
review-only boundary and does not replace fresh intake/source preflight,
rights, package, QR, persistence, or release evidence.

See ADR 1435 and `scripts/create-publisher-pilot-intake-revision.mjs`.
