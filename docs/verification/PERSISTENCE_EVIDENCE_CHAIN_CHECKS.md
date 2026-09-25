# Persistence Evidence Chain Checks

This check protects the tamper-evident chain for closed-pilot persistence
operation receipts.

- `npm run verify:durable-operations` must pass.
- Each completed backup, restore, or retention-deletion receipt must preserve
  the previous receipt hash and its own canonical evidence hash.
- Existing evidence rows must be backfilled safely when the chain columns are
  introduced; the migration must not store student-session identifiers.
- Health diagnostics must detect a changed receipt and report the chain as
  unhealthy.
- Teacher status may show verified receipt count and integrity state, but not
  the learner payload or any mutation controls.
- Tenant teacher history must require a separate expiring teacher session with
  the `persistence:read` scope and an explicit tenant allowlist. The student
  session cookie must never authorize teacher history.
- Tenant history may contain only receipts carrying the matching one-way tenant
  scope digest; platform-wide backup and restore receipts remain hidden from
  tenant teachers.
- Restore must validate a complete backup manifest, including supported schema,
  positive bytes and retention, valid timestamp, lowercase SHA-256, and
  explicit exclusion of raw learner audio and transcripts. Declared bytes and
  checksum must match the source artifact.
- This chain is tamper-evident, not a replacement for access control, encrypted
  storage, external backup custody, or an immutable audit service.
