# DR-1249: Local Package QR Review Route

- **Decision:** add a read-only package-scoped QR mapping review route.
- **Scope:** tenant, package, version, printed QR identity, unit, target, and
  declared local fallback.
- **Allowed:** verified metadata read and bounded rehearsal link.
- **Blocked:** redirect mutation, print authorization, student activation,
  package writes, hosted persistence, learner records, and release changes.
- **Reason:** QR print evidence must be reviewable without making the local
  companion or hosted registry operational by implication.
- **Exit evidence:** route verifier, foundation composition, typecheck, and
  production build pass. Human print authorization remains outstanding.
