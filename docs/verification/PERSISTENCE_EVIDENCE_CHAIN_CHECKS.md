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
- This chain is tamper-evident, not a replacement for access control, encrypted
  storage, external backup custody, or an immutable audit service.
