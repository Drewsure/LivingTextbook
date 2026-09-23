# ADR 1130: Human Approval Gate on Release Control

## Decision

Show the review-only reviewer identity and signature gate in the tenant-scoped
release-control decision room next to the composite evidence binding and the
package approval ledger.

## Boundaries

This is a prerequisite map, not an approval workflow. It cannot capture a
signature, freeze a packet, write an audit record, download evidence, mutate
release state, activate an assignment, or launch students.

## Verification

- `npm run verify:routes`
- `npm run verify:foundation`
