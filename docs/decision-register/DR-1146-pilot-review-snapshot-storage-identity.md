# DR-1146: Pilot Review Snapshot Storage Identity

Decision: Make storage-selection identity explicit at the provider-neutral pilot
review snapshot boundary.

- Require storage preflight and evidence-storage gate IDs on every snapshot.
- Require the snapshot values to match the embedded pilot decision exactly.
- Keep blocked status, disallowed selection, no side effects, and no learner
  data guarantees intact across hosted-managed and local-classroom rehearsal.

References: ADR 1146, Build session 1060, DR-1145, and the pilot review
snapshot runtime verification.
