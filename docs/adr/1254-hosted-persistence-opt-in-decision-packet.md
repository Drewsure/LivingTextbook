# ADR 1254: Hosted Persistence Opt-In Decision Packet

- **Status:** Accepted for foundation implementation; release-blocked
- **Decision:** Represent a future hosted or hybrid persistence choice as one
  package-scoped, review-only decision packet that binds the reviewed package
  lineage to policy, provider, release, cost, and rollback evidence.
- **Allowed:** A read-only workbench may show the candidate delivery mode,
  provider candidate, unresolved checks, required human decisions, and the
  explicit no-write boundary.
- **Blocked:** Provider selection, credentials, learner records, migration,
  activation, and durable writes remain unavailable until a separate human
  opt-in decision and deployment gate are accepted.
- **Reason:** A saleable white-label pilot needs a clear commercial handoff
  between the publisher's package decision and the platform's hosted option.
  Scattering this decision across provider and activation panels invites
  accidental activation and makes local fallback obligations easy to miss.
- **Exit evidence:** The content-model validator, sample workbench panel,
  foundation verifier, typecheck, build, and route preview pass. Real tenant
  policy, provider, cost, release, and rollback evidence remain required.
