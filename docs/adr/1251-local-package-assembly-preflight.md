# ADR 1251: Local Package Assembly Preflight Binding

- **Status:** Accepted for foundation implementation; release-blocked
- **Decision:** Add a read-only preflight that joins a durable quarantine package
  review packet to the required inputs of the local/package writer.
- **Allowed:** Tenant-scoped metadata read, checksum reconciliation, missing-input
  explanation, and teacher review visibility.
- **Blocked:** Package JSON, route, playlist, local-bundle, QR, persistence, and
  student-facing writes.
- **Reason:** The pilot needs a visible, honest handoff between “review packet
  captured” and “a human may later request package assembly.” The existing writer
  validates approved delivery artifacts, but the publisher intake lane had not
  shown those dependencies in one place.
- **Exit evidence:** Contract verifier, full foundation suite, typecheck, and
  production build pass. Human source, rights, provider, release, and policy
  evidence remain required.
