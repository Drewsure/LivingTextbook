# DR-676: Backend Lifecycle Policy Contract

Status: Accepted

## Decision

The backend alignment validator now requires migration specs to declare
retention, export, and local-fallback rules, and requires migration candidates
to declare rollback or export needs and a non-empty purpose.

## Rationale

- Hosted and local deployments need the same recovery and portability intent.
- Retention and export must be reviewed before a storage vendor is chosen.
- Missing lifecycle text is a silent operational risk, not a cosmetic defect.

## Evidence

- Current sample candidates and specs pass the policy checks.
- Regression coverage rejects a missing retention rule and missing
  rollback/export needs.

This decision is recorded in
`docs/adr/0604-backend-lifecycle-policy-contract.md`.
