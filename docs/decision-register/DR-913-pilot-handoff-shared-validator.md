# DR-913: Pilot Handoff Shared Validator

## Decision

Move pilot handoff package types and safety invariants into the shared
content-model package and show concrete validator findings on the pilot command
view.

## Included

- Review-only package mode.
- Tenant-bound route requirements for entry, launch, and teacher review.
- Unique route, asset, and decision identifiers.
- Required student-data policy blocker.
- Runtime behavior coverage for valid and malformed packages.

## Excluded

Storage, export, publishing, policy acceptance, classroom launch, and real
learner data.

See ADR 0841.
