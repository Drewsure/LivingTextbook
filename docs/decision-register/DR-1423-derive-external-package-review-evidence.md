# DR-1423: Derive External Package Review Evidence From Canonical Records

- **Decision:** Derive the external package-review evidence record from the
  canonical source preflight and tenant-scoped package evidence review.
- **Reason:** Prevent manual checksum and lane-reference transcription errors in
  the saleability handoff.
- **Boundary:** One external create-once metadata record; no file copying,
  assembly, QR printing, persistence activation, or student use.
- **Verification:** `node scripts/create-pilot-package-review-evidence-from-record.mjs
  --self-test`, the intake-kit verifier, and the foundation composition suite.
- **Related:** ADR 1423 and Principles and Standards 665.
