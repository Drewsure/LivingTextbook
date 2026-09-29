# ADR 1250: Local Package Review Packet Snapshot

- **Status:** Accepted for foundation implementation; release-blocked
- **Decision:** Persist one immutable, tenant-scoped metadata snapshot that joins
  quarantine intake, admission preview, package handoff preview, and any recorded
  teacher review decision.
- **Allowed:** Explicitly gated local metadata write, checksum reconciliation,
  idempotent reread, and teacher review visibility.
- **Blocked:** Raw payload export, evidence attachment storage, package assembly,
  content promotion, QR print authorization, hosted persistence activation, and
  student-facing use.
- **Reason:** A saleable publisher workflow needs a durable review packet that a
  later package assembler can consume without reconstructing lineage from an
  ephemeral preview. Persisting the packet must not be mistaken for approval.
- **Feature gate:** `LIVING_TEXTBOOOK_PACKAGE_REVIEW_PACKETS_ENABLED=true`.
- **Exit evidence:** Contract verifier, typecheck, production build, and the full
  foundation suite pass. Human evidence, rights, accessibility, provider, device,
  rollback, and release decisions remain required.
