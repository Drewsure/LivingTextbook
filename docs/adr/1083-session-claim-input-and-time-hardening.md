# ADR 1083: Session Claim Input and Time Hardening

## Decision

Student launch-session inputs are bounded before route resolution and cookie
creation: tenant, package, launch, and user identifiers are limited to 160
characters; the entry code is limited to 512 characters.

Student and teacher signed-session readers reject claims whose `issuedAt` is
more than 30 seconds in the future, whose `expiresAt` is already past, or
whose expiry is not later than issuance.

## Rationale

Signed cookies prevent client-side tampering, but a server should still bound
the input used to create a cookie and reject temporally incoherent claims.
These checks reduce oversized identity state and make clock/expiry failures
fail closed before tenant-scoped persistence reads or writes.

## Consequences

- Existing QR and front-door clients remain within the reviewed limits.
- A malformed or oversized session request returns `400` without a cookie.
- A signed but temporally invalid claim is treated as anonymous.
- Session authorization remains separate from tenant, deployment, and policy
  gates.

## Verification

- `scripts/verify-persistence-read-authorization.mjs`
- `npm run verify:persistence-runtime`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

