# DR-906: Teacher Operations Runtime Verification

## Decision

Maintain an opt-in runtime verifier for the tenant-scoped teacher operations
boundary. It must exercise authenticated same-tenant access, cross-tenant
rejection, and privacy-safe unauthorized responses against a deliberately
configured deployment. A second deployment can prove revocation of an existing
cookie after allowlist removal.

## Included

- Teacher review-code exchange and signed-session discovery.
- Persistence status and operation-history read checks.
- Cross-tenant `401` checks without provider disclosure.
- Optional revoked-deployment checks.

## Excluded

- Production credentials, learner records, durable writes, exports, classroom
  launch, and deployment mutation.

See ADR 0834 and
`docs/verification/TEACHER_OPERATIONS_AUTHORIZATION_CHECKS.md`.
