# DR-1255: Hosted Opt-In Packet Delivery Binding

- **Decision:** Add `hostedPersistenceDecisionPacketId` to governed delivery
  manifests and package indexes.
- **Invariant:** Hosted and hybrid packages must carry a non-empty packet id;
  closed-local packages must carry `null`.
- **Boundary:** The binding proves lineage only. It does not authorize provider
  selection, credentials, learner records, writes, QR mutation, or student
  activation.
- **Human action:** After the real publisher package is reviewed, the tenant
  must complete the packet's provider, policy, cost, release, and rollback
  decisions before a hosted status can move beyond review.
