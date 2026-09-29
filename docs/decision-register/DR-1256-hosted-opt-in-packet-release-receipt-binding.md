# DR-1256: Hosted Opt-In Packet Release Receipt Binding

- **Decision:** Preserve `hostedPersistenceDecisionPacketId` across the
  delivery manifest, manual release receipt, package index, metadata writer,
  and local runtime summary.
- **Invariant:** Hosted and hybrid records must agree on the packet identity;
  closed-local records must use `null`.
- **Failure rule:** Missing or drifted identity blocks metadata handoff and
  local runtime availability.
- **Human action:** A real publisher still must complete provider, policy,
  cost, release, and rollback decisions before hosted persistence can be
  enabled.
