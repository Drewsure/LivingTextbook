# DR-677: Policy Blocker Evidence Contract

Status: Accepted

## Decision

The backend alignment validator now requires explicit prerequisites on
`needs-policy` migration candidates and explicit policy blockers on
`blocked-by-policy` migration specifications.

## Rationale

- Technical status alone cannot communicate a safe white-label rollout gate.
- Explicit blockers make policy review and handoff auditable.
- The same evidence shape can serve hosted and closed/local deployment plans.

## Evidence

- Current policy-blocked samples pass the new rules.
- Regression coverage rejects missing policy blockers and missing
  policy prerequisites.

This decision is recorded in
`docs/adr/0605-policy-blocker-evidence-contract.md`.
