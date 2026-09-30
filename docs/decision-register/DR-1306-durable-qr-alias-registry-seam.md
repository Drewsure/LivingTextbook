# DR-1306: Durable QR Alias Registry Seam

The first durable QR registry path is a guarded metadata-only writer. It may
persist an approved, checksum-bound alias record under a tenant/package/version
custody path, with atomic write, idempotent replay, immutable conflict handling,
and fail-closed reads.

The record does not mutate routes, swap packages, activate students, or include
publisher payload bytes or learner records. The explicit registry-write gate
and custody root must be configured before any write can occur.

This does not close the pilot release gate. Human release approval, rollback
evidence, local fallback testing, and print authorization remain required.

See `docs/adr/1307-durable-qr-alias-registry-seam.md`.
