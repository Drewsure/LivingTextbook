# DR-1149: Adapter Write-Intent Storage Identity

Decision: Preserve exact storage-selection preflight and evidence-storage gate
identity on hosted and local teacher-draft persistence write intents.

- Require blocked and disallowed storage values on every readiness write intent.
- Reject missing, enabled, or drifted identity before future adapter work-order
  authorization.
- Keep write, upload, migration, route, assignment, and promotion actions
  blocked.

References: ADR 1149, Build session 1063, DR-1148, and the adapter write-intent
behavior verifier.
