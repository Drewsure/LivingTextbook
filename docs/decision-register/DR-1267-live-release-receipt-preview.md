# DR-1267: Live Release Receipt Preview

**Status:** Accepted

**Decision:** Add a tenant- and checksum-bound release-receipt preview to the
live quarantine handoff, with pending reviewer, rollback, release, and QR
authorization fields.

**Reason:** A real publisher submission must show its own release boundary;
static reference receipts cannot prove saleable-package readiness.

**Boundary:** Preview only. No receipt write, package assembly, QR mutation,
persistence activation, or student use is enabled.
