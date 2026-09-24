# DR-1150: Durable Record Storage Identity

Decision: Preserve exact storage-selection preflight and evidence-storage gate
identity on the teacher-draft persistence implementation-readiness durable
record.

- Require nonblank preflight and gate identifiers.
- Require blocked status and disallowed selection.
- Reject incomplete or enabled durable records before future adapter
  authorization.
- Keep writes, uploads, migration, route mutation, assignment, and promotion
  blocked.

References: ADR 1150, Build session 1064, DR-1149, and the durable-record
behavior verifier.
