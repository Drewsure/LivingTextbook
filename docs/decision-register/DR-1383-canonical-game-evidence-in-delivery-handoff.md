# DR-1383: Canonical Game Evidence in Delivery Handoff

## Decision

Carry canonical game-derived evidence IDs from package review into the
publisher delivery handoff and validate them before downstream release
lineage can describe package evidence as complete.

## Consequences

- Reviewers can trace game readiness across package review and delivery mode.
- Local, hosted, and hybrid handoffs share one auditable game-evidence set.
- Incomplete or lane-only records remain visibly blocked.
- No release, QR, persistence, or student-use capability is added.

## Verification

`node scripts/verify-publisher-delivery-handoff-record.mjs`

`npm run verify:foundation-composition`
