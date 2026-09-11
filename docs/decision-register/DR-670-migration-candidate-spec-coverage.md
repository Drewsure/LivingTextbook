# DR-670: Migration Candidate Spec Coverage

Status: Accepted

## Decision

Non-deferred migration candidates require at least one migration spec;
deferred candidates must not carry implementation specs.

## Rationale

- Actionable backend work needs an explicit vendor-neutral record contract.
- Deferred work should remain visible without implying implementation
  readiness.
- Hosted and closed/local sequencing stays auditable in one place.

## Guardrails

- This does not enable live persistence or select a backend vendor.
- The local export/restore candidate remains deferred until its policy and
  sequencing requirements are accepted.

## Evidence

- Current coverage has specs for all non-deferred candidates.
- Regression coverage rejects the deferred local export candidate when changed
  to ready-to-design without a spec.

This decision is recorded in
`docs/adr/0598-migration-candidate-spec-coverage.md`.
