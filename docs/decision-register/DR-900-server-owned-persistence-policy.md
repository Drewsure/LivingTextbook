# DR-900: Server-Owned Persistence Policy

## Decision

Separate browser persistence intent from server-owned institutional policy.
The browser may request a persistence mode, while the server derives policy
acceptance and write authorization from deployment configuration before
validation or provider execution.

## Included

- A client request contract with tenant/session identity, envelope, and
  `requestedMode` only.
- Rejection of client-supplied policy objects.
- Server-owned derivation of school, retention, release, and write gates.
- Runtime assertions that the derived policy cannot be replaced by browser
  claims.

## Excluded

- Enabling durable writes, selecting a production vendor, accepting school
  policy, or changing the review-only default.

## Evidence

- `packages/content-model/src/hostedProgressionPersistence.ts`
- `apps/web/src/app/api/persistence/progression/route.ts`
- `apps/web/src/features/persistence/hostedProgressionPersistenceClient.ts`
- `scripts/verify-runtime-behavior.mjs`

See `docs/adr/0828-server-owned-persistence-policy.md` and
`docs/verification/PERSISTENCE_SERVER_POLICY_BOUNDARY_CHECKS.md`.
