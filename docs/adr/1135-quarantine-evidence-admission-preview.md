# ADR 1135: Quarantine Evidence Admission Preview

## Status

Accepted for foundation implementation; promotion remains disabled.

## Decision

Add a provider-neutral admission preview that compares a validated quarantine
intake record with the evidence required by its target lane. The preview must
consider security scan, rights proof, source approval, target mapping,
accessibility, and release-control evidence.

The preview may report `needs-review` or `evidence-ready`, but it must always
return `promotionAllowed: false`, `studentFacingAllowed: false`,
`mode: review-only`, and `sideEffect: none`. Evidence completeness is not
authorization, storage selection, publication, assignment, or student launch.

## Consequences

- Hosted and closed-local adapters have one shared gate vocabulary.
- A future reviewer can distinguish missing evidence from deployment approval.
- The platform can add target-specific evidence without changing the intake
  record or exposing raw files.
