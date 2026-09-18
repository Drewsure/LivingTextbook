# Package Readiness Persistence Checks

This checklist protects the first durable record shape for package readiness
reconciliation. It is a metadata contract only. Passing these checks must not
be interpreted as provider selection, storage activation, package promotion, or
student launch approval.

## Required checks

- The shared content model exposes a tenant-scoped package-readiness
  persistence intent.
- The intent preserves all seven reconciliation references:
  source assembly, approval ledger, verifier evidence, target-language audio,
  media rights, publish gate, and assignment rollout.
- Hosted database and local classroom store are represented as provider-neutral
  store tiers.
- Provider selection remains null.
- Write, promotion, and student-facing activation flags remain false.
- Raw learner audio, learner transcripts, and student data remain excluded.
- Duplicate intent identifiers and missing evidence references are rejected.
- The teacher persistence workbench shows the metadata preview and blocked
  actions for both sample tenants and both store tiers.
- The active route verifier checks the persistence workbench markers.

## Explicit non-goals

- No database table, object bucket, local folder, signed URL, migration, backup,
  export, upload, package writer, route write, playlist write, assignment write,
  or student-facing activation is enabled by this slice.
