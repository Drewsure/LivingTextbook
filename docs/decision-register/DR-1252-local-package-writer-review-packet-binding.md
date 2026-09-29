# DR-1252: Local Package Writer Review-Packet Binding

- **Decision:** The local package writer must receive and validate the exact
  durable package review packet before any package assembly side effect.
- **Required identity:** tenant, quarantine record, review packet, package, and
  source assembly checksum must agree across the request, packet, and delivery
  manifest.
- **Required decision:** The packet must be `ready-for-next-gate` and carry
  `accepted-for-package-review`.
- **Safety:** A failed binding returns a blocked result and performs no asset
  copy, QR generation, local package write, hosted persistence activation,
  student activation, or learner-record write.
- **Release boundary:** A successful binding does not itself authorize release,
  QR printing, hosted persistence, or student use.
- **Human follow-up:** Supply a real publisher Unit 1 packet, complete the
  rights/media/policy evidence, and record the separate delivery and release
  approvals before assembly is considered saleable.
