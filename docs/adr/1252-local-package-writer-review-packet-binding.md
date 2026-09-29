# ADR 1252: Local Package Writer Review-Packet Binding

- **Status:** Accepted for foundation implementation; release-blocked
- **Decision:** Require the local package assembly endpoint to bind every write
  request to the exact durable quarantine package review packet for the same
  tenant, quarantine record, package, and source checksum.
- **Allowed:** A separately authenticated, explicitly gated assembly request
  may proceed to the existing writer only after the packet is ready and the
  delivery/release contracts pass their own validation.
- **Blocked:** Missing, blocked, wrong-decision, stale, cross-tenant,
  cross-package, and checksum-mismatched review packets fail before asset copy,
  QR generation, or local package mutation.
- **Reason:** A release receipt proves delivery authorization, but it does not
  prove that the publisher source was reviewed and reconciled. The saleable
  pilot needs both lineages bound together.
- **Exit evidence:** Review-packet binding verifier, typecheck, production
  build, and full foundation suite pass. Real publisher source, rights, media,
  deployment, and release evidence remain required for sale approval.
