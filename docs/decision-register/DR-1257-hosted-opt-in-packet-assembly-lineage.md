# DR-1257: Hosted Opt-In Packet Assembly Lineage

- **Decision:** Carry `hostedPersistenceDecisionPacketId` into the delivery
  handoff record and local package assembly record.
- **Invariant:** All delivery records agree with the manifest; closed-local
  records remain explicitly `null`.
- **Failure rule:** Missing or drifted packet identity blocks package
  reconciliation and local runtime availability.
- **Human action:** No hosted or hybrid pilot may proceed to actual provider
  writes until the named publisher and school opt-in packet is accepted by a
  later activation gate.
