# DR-1278: Live Hosted Opt-In Preview

- **Decision:** Derive a live, package-scoped hosted opt-in preview for hosted or hybrid delivery selections.
- **Bound identities:** Tenant, package, quarantine, review packet, and source checksum.
- **Required decisions:** Provider, policy/retention, cost, release, rollback, and human opt-in.
- **Not enabled:** Hosted writes, credentials, learner records, student activation, or automatic opt-in.
- **Verification:** `scripts/verify-hosted-persistence-opt-in-decision-packet.mjs` and `scripts/verify-foundation-composition.mjs`.
