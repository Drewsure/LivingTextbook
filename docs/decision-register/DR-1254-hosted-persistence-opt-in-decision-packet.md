# DR-1254: Hosted Persistence Opt-In Decision Packet

- **Decision:** Add a package-scoped hosted persistence opt-in decision packet
  that joins review lineage, provider selection, policy/retention, release,
  cost, and rollback evidence.
- **Status:** Implemented as review-only foundation; provider activation remains
  blocked.
- **Invariant:** `providerSelected`, `optInRecorded`, `writesAllowed`,
  `activationAllowed`, and `learnerRecordsIncluded` must remain false until a
  later, explicitly authorized gate is implemented.
- **Human action:** A real publisher must name the delivery mode, accept the
  school data policy, set usage and cost limits, approve release ownership,
  and complete hosted/local recovery rehearsal before this can progress.
- **Related files:**
  `packages/content-model/src/hostedPersistenceOptInDecisionPacket.ts`,
  `apps/web/src/data/sampleHostedPersistenceOptInDecisionPacket.ts`, and
  `apps/web/src/features/persistence/HostedPersistenceOptInDecisionPacketPanel.tsx`.
