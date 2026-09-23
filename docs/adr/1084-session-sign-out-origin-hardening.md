# ADR 1084: Session Sign-out Origin Hardening

## Status

Accepted and implemented on `legacy-source-import`.

## Context

Student and teacher session issuance already required an exact same-origin
mutation. The corresponding DELETE routes cleared HttpOnly cookies without
using that shared boundary, leaving the session mutation policy asymmetric.

## Decision

Require `validateSameOriginMutation` before both session DELETE handlers clear
their cookies. Originless and cross-origin sign-out requests return `403` and
perform no cookie mutation.

## Consequences

- Browser sign-out remains same-origin and deterministic.
- Cross-origin requests cannot use the sign-out endpoint as a cookie mutation
  primitive.
- The policy is shared by issuance and sign-out, so future session routes must
  satisfy one verifier contract.
- This does not activate persistence or change tenant authorization.

## Verification

Run `npm run verify:persistence-runtime`, then the full `npm run
verify:foundation` gate before publishing a session-route change.
