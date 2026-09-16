# Persistence Operations Evidence Checks

This check protects the metadata-only audit boundary for closed-pilot
progression operations.

- `npm run verify:durable-operations` must pass.
- Backup, restore, and retention deletion must emit completed operation
  receipts server-side.
- Receipts may contain operation type, timestamp, schema version, checksum,
  byte size, retention period, deletion count, and a one-way scope digest.
- Receipts must not contain tenant-scoped student-session IDs, progression
  payloads, raw learner audio, transcripts, credentials, or database paths.
- The read-only operations route may return receipts but must not accept POST,
  DELETE, or other browser mutation requests.
- The teacher history surface must not expose operation buttons or claim that
  a receipt is permission to export, launch, restore, or delete from the
  browser.
