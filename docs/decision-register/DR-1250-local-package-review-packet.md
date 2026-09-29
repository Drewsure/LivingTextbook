# DR-1250: Local Package Review Packet Snapshot

- **Decision:** Add a durable, immutable, metadata-only review packet under the
  quarantine custody root.
- **Why now:** The pilot had a useful handoff preview but no stable record that a
  future package assembler could reconcile against the source checksum.
- **Included lineage:** Intake record, review summary, admission preview, package
  handoff preview, and optional immutable teacher review decision.
- **Status semantics:** `blocked` until all current blockers are cleared;
  `ready-for-next-gate` means only that the packet can proceed to a separate
  evidence-storage/package gate.
- **Safety:** The packet can never authorize package assembly, promotion, QR
  printing, hosted persistence, or student use. Writes require the explicit
  `LIVING_TEXTBOOOK_PACKAGE_REVIEW_PACKETS_ENABLED` gate and use create-only
  storage with idempotent rereads.
- **Human action remaining:** Choose an approved evidence provider and complete
  rights, scan, accessibility, release, device, rollback, and school-policy
  review before any saleable pilot claim.
