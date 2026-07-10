# DR-120: Release Candidate Migration Spec

## Decision

Add package release candidate status to backend migration candidates and vendor-neutral migration specifications.

## Reason

The durable record model now includes package release candidate status. Backend migration planning must carry the same concept so hosted and local implementations do not invent incompatible release-control shapes later.

## Standard

- Release-control migration candidates include `package_release_candidate`.
- Migration specs include package release candidate fields, indexes, retention, export, local fallback, and policy blockers.
- Candidate status is derived from publish gate and approval ledger state.
- Manual pilot-ready overrides are forbidden.
- Local classroom export/restore includes release candidate status with publish gates and approval ledgers.

