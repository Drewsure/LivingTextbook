# DR-1279: Hosted Manifest Fail-Closed Boundary

- **Decision:** Calculate mode-specific hosted packet requirements before
  delivery-manifest readiness.
- **Blocked case:** Hosted or hybrid mode without a package-scoped hosted
  persistence decision packet.
- **Preserved case:** Closed-local mode remains ready without hosted packet
  identity when its independent gates pass.
- **Not enabled:** Provider selection, credentials, hosted writes, learner
  records, or student activation.
- **Verification:** `scripts/verify-pilot-delivery-manifest-behavior.mjs`,
  `scripts/verify-foundation-composition.mjs`, typecheck, and production build.
