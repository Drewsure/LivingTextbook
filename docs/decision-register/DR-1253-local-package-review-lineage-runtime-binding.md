# DR-1253: Local Package Review Lineage Runtime Binding

- **Decision:** Store and verify `package-review-binding.json` in every local
  package assembled through the controlled writer.
- **Identity:** Tenant, quarantine record, review packet, package, and source
  assembly checksum must agree with the delivery metadata and assembly record.
- **Runtime rule:** The local package status, content, and media readers must
  fail closed when review lineage is absent or mismatched.
- **Boundary:** Review lineage does not authorize student activation, hosted
  persistence, QR mutation, report export, or support-language-only progress.
- **Human follow-up:** A real publisher package must complete review, rights,
  audio/media, release, and device evidence before this lineage can support a
  saleable pilot.
