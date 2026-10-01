# DR-1412: Pilot Human Evidence Packet

- **Decision:** Use an external two-file packet for delivery policy and release
  authorization evidence.
- **Reason:** Make human-owned pilot decisions explicit and auditable without
  creating a release workflow or treating previews as approval.
- **Required evidence:** Delivery mode, persistence choice, retention, backup,
  cost, rollback, reviewer identity, QR print authorization, rehearsal,
  student-use authorization, and source/package/QR checksums.
- **Boundary:** Metadata-only validation; no upload, assembly, printing,
  persistence activation, route mutation, or learner access.
- **Verification:** `npm run verify:pilot-human-evidence -- --self-test` and
  `npm run audit:pilot -- --json`.
