# DR-1317: Tenant-bound quarantine service credential

- **Decision:** Bind the controlled quarantine bearer credential to an explicit
  tenant allowlist and reuse the rule across intake and review APIs.
- **Why now:** The first saleable white-label pilot must protect publisher
  isolation before real textbook files, audio, video, or images enter the
  system.
- **Scope:** Review-only quarantine intake and review routes. Same-origin
  teacher authorization remains tenant-scoped.
- **Configuration:**
  `LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_API_TOKEN` plus
  `LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ALLOWED_TENANTS` (comma-separated exact
  tenant identifiers).
- **Rejected approach:** Treating possession of a deployment-wide token as
  permission for every caller-supplied tenant.
- **Verification:** Cross-tenant intake and review probes are rejected by the
  publisher rehearsal; allowed-tenant rehearsal remains functional.
- **Follow-up:** Record the tenant allowlist in the pilot deployment handoff;
  never place the bearer token or raw upload paths in client-facing evidence.
