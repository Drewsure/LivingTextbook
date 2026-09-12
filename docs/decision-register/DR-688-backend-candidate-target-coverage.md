# DR-688: Backend Candidate Target Coverage

Status: Accepted

## Decision

Every non-deferred migration candidate must have specification coverage for all
declared target schema entities. Missing coverage is a backend alignment error.

## Evidence

- Added package publish-gate and package approval-ledger specifications.
- Regression coverage rejects removing approval-ledger coverage from the
  release-control candidate.
- Backend storage readiness passes with 109 schema entities, 104 candidates,
  and 103 specifications.
- No backend provider or live storage write was enabled.

This decision is recorded in
`docs/adr/0616-backend-candidate-target-coverage.md`.
