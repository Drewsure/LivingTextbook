# DR-1280: Release Receipt Manifest Validation

- **Decision:** Receipt approval must validate the complete delivery manifest
  and require its ready/delivery flags to agree.
- **Blocked case:** A contradictory or invalid manifest cannot produce an
  approved release receipt, even with reviewer and rollback fields present.
- **Evidence surfaced:** Manifest validation errors remain in the receipt's
  unresolved requirements.
- **Not enabled:** Receipt writes, package assembly, QR printing, hosted
  persistence, or student activation.
- **Verification:** `scripts/verify-pilot-delivery-manifest-behavior.mjs`,
  `scripts/verify-foundation-composition.mjs`, typecheck, and production build.
