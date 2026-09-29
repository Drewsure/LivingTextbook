# DR-1237: Controlled Pilot Delivery Writer

- **Decision:** Implement the first real writer as an authenticated,
  custody-root-bound metadata writer.
- **Purpose:** Convert an approved manifest and release receipt into an
  immutable publisher handoff record plus a metadata-only package index,
  without copying unreviewed payloads or activating students.
- **Required controls:** Dedicated operator token, explicit write feature flag,
  approved manifest and receipt, identity/checksum binding, bounded operator
  identity, filesystem custody validation, and immutable conflict handling.
- **Current state:** Implemented but disabled by default; the current sample is
  blocked and produces no files.
- **Verification rule:** A write is not accepted as delivered until the
  authenticated read-back path validates the manifest, receipt, handoff record,
  identity bindings, checksum, package-index coverage, and metadata-only marker.
- **Next evidence:** A real publisher package with complete rights/audio/game
  evidence, approved release receipt, custody-root test, local/hosted delivery
  selection, and a post-write verification/rollback rehearsal.
