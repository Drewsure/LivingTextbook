# DR-905: Unauthorized Operations Privacy Parity

## Decision

Make unauthorized persistence operation-history responses as privacy-safe as
unauthorized persistence status responses. Provider and deployment details are
withheld until the tenant-scoped teacher operations boundary passes.

## Included

- Removal of provider data from the unauthorized operation-history response.
- Explicit source verification for the protected branch.
- Continued metadata-only, tenant-filtered responses after authorization.

## Excluded

- Changes to teacher authentication, durable writes, backup, restore, deletion,
  export, or classroom launch.

See ADR 0833 and
`docs/verification/TEACHER_OPERATIONS_AUTHORIZATION_CHECKS.md`.
