# DR-1039: Tenant-Supplied Release Review Links

Decision: keep the white-label release-readiness panel tenant-neutral by
receiving its evidence-workbench links from the tenant-scoped page contract.

Required invariants:

- The reusable panel must not hard-code a sample tenant's requirements route.
- The page that owns the tenant/package readiness record must supply the
  tenant-scoped partner requirements link.
- Review links remain navigation to evidence surfaces only.
- Link presence never authorizes persistence, package promotion, external game
  import, QR redirect mutation, or student launch.

Evidence: `apps/web/src/features/release/WhiteLabelReleaseReadinessPanel.tsx`,
`apps/web/src/app/teacher/release-readiness/page.tsx`, and
`docs/adr/0967-tenant-supplied-release-review-links.md`.
