# DR-1410: Visible Saleability Audit

- **Decision:** Show `npm run audit:pilot -- --json` in the tenant-scoped
  publisher requirements workspace.
- **Reason:** Keep operator-facing status aligned with the fail-closed audit and
  make human-owned gates visible before release discussion.
- **Boundary:** Read-only informational surface; no upload, assembly, QR,
  persistence activation, release, or student access.
- **Verification:** `npm run verify:publisher-pilot-intake-kit` and the active
  route preview check for the requirements workspace.
