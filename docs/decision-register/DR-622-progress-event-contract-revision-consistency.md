# DR-622: Progress Event Contract Revision Consistency

Status: Accepted

Decision: Require one `taxonomy_version` and one `settings_contract_id` across each progress-event stream.

Rationale:

- Reports and persistence batches need one reviewed interpretation contract.
- Matching unit, launch, and acceptance-gate identities are not sufficient to prove semantic compatibility.
- Distinct game modes may still use distinct profiles and snapshots within the same settings contract.

Guardrails:

- Mixed taxonomy versions and settings contract IDs block review.
- The check is verification-only and does not enable live gameplay, scoring, persistence, or provider writes.

Related ADR: `docs/adr/0550-progress-event-contract-revision-consistency.md`
