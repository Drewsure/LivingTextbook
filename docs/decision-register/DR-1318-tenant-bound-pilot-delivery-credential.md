# DR-1318: Tenant-bound pilot delivery credential

- **Decision:** Bind the controlled pilot-delivery bearer credential to an
  explicit tenant allowlist and use that rule across delivery metadata, QR
  registry, release receipt, and local package assembly routes.
- **Why now:** The first saleable white-label pilot must be able to produce a
  closed-local package and QR sheet without weakening publisher isolation.
- **Configuration:**
  `LIVING_TEXTBOOOK_PILOT_DELIVERY_API_TOKEN` plus
  `LIVING_TEXTBOOOK_PILOT_DELIVERY_ALLOWED_TENANTS` (comma-separated exact
  tenant identifiers).
- **Rejected approach:** Treating a valid delivery token as permission for all
  tenants in the deployment.
- **Verification:** The publisher rehearsal continues for its allowed tenant;
  an unlisted tenant's delivery metadata read is rejected.
- **Follow-up:** Include the allowlist in the pilot deployment handoff and
  rotate the token through the deployment secret manager, never through a
  client route or downloadable evidence packet.
