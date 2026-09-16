# Durable Progression Operations Checks

This check protects the closed-pilot operations boundary for the first SQLite
progression provider.

- `npm run verify:durable-operations` must pass.
- Backup evidence must use SQLite `VACUUM INTO` and pass an integrity check.
- Every backup must emit a SHA-256 checksum manifest containing schema,
  creation time, retention period, and raw-audio/transcript exclusion markers.
- Restore evidence must preserve the expected progression table and all tenant
  records in a temporary restored database.
- Restore must compare the source file checksum with the reviewed manifest
  before it is treated as evidence.
- Retention deletion must require school-policy, retention-policy, release,
  and explicit operations gates.
- Deletion must be scoped to one tenant/package/launch/student-session identity
  and must not remove another tenant's record.
- The teacher status endpoint may report provider, durability, policy state,
  and health, but must not return learner records, database paths, credentials,
  raw audio, or transcripts.
- Backup, restore, deletion, and export remain server-side procedures; no
  browser button may imply that a teacher can mutate live learner data.

The verification script creates and removes only temporary SQLite files. It
does not use the project database and does not alter release, route, QR, or
learner state.
