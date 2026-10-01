# DR-1411: Saleability Audit Canonical Verifiers

- **Decision:** Reuse the canonical publisher intake preflight and Phaser
  evidence-return verifier inside `audit:pilot` when supplied roots exist.
- **Reason:** Prevent marker folders, incomplete kits, and frozen snapshots from
  being counted as saleability evidence.
- **Boundary:** Read-only subprocess checks; no source import, assembly, QR
  printing, release, persistence activation, or student access.
- **Verification:** `node --check scripts/audit-first-saleable-pilot.mjs`,
  `npm run audit:pilot -- --json`, and the foundation composition suite.
