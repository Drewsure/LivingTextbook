# DR-1422: Durable Reviewed Package Evidence

- **Decision:** Add `package-review-evidence.json` to the external human
  evidence packet and require it in the first-pilot saleability audit.
- **Scope:** Content, curated game pathways, audio, video, image, font,
  accessibility, and rights review lanes.
- **Safety:** The record is create-once, metadata-only, checksum-bound, and
  cannot authorize promotion or student-facing activation.
- **Verification:** `node scripts/verify-pilot-package-review-evidence.mjs
  --self-test`, `node scripts/verify-pilot-human-evidence.mjs --self-test`, and
  the foundation composition suite.
- **Related:** ADR 1422 and Principles and Standards 664.
