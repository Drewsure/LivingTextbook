# DR-049: Backend Migration Candidates

Date: 2026-07-09

## Status

Accepted

## Decision

Add backend migration candidates as a vendor-neutral implementation plan before writing production migrations or selecting a storage vendor.

## Rationale

The project now has a backend decision matrix, schema draft, durable records, and adapter write intents. The next risk is jumping from schema straight to a vendor-specific migration. Migration candidates preserve sequence, prerequisites, rollback/export needs, and forbidden shortcuts before implementation starts.

## White-Label Impact

Positive. The plan keeps tenant, package, QR, media, release-control, launch-session, event-stream, and local export records as platform concepts that can be implemented for multiple tenants and deployment styles.

## Cost Impact

Positive. Ordered migration candidates reduce rework by putting low-risk administrative records before policy-heavy student progress storage and before high-cost local/closed deployment work.

## Constraints

- No production migrations before backend choice and policy gates are accepted.
- No real student progress storage before privacy, retention, export, and access rules are accepted.
- Release-control records must be migrated before packages can become pilot-publishable.
- Local classroom export/restore remains deferred until hosted pilot schema is validated.
- Raw learner audio and transcripts stay out of core storage.

## Verification

Use `docs/verification/BACKEND_MIGRATION_CANDIDATES_CHECKS.md` after pulling connector-side commits.
