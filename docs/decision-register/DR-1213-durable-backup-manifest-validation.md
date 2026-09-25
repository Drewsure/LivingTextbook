# DR-1213: Durable Backup Manifest Validation

The SQLite restore path now validates the complete backup manifest and matches
its declared bytes, checksum, and schema against the source artifact before
restore. Invalid versions, timestamps, retention values, checksums, byte counts,
schema values, or learner-data exclusion flags fail closed. Persistence remains
behind the existing operations and deployment approval gates.

References: ADR 1213 and the 2026-09-25 durable-backup-manifest-validation
build session.
