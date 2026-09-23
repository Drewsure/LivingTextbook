# ADR 1081: Same-Origin Mutation Boundary

## Decision

Cookie-authenticated JSON mutations must carry an `Origin` header that exactly
matches the request origin. Cross-origin or originless browser mutations return
`403` before provider access or session side effects.

Persistence progression and event writes may use the configured bearer token
for explicitly authorized server-to-server operation; that path is the only
exception to the browser-origin requirement.

## Rationale

The platform uses signed learner and teacher cookies. Same-origin enforcement
prevents a cross-site caller from causing a browser carrying one of those
cookies to submit a state-changing request. This is separate from tenant
authorization, policy acceptance, and durable-provider activation.

## Consequences

- The browser clients remain compatible because they already use same-origin
  fetches.
- Server integrations must use the configured bearer token on persistence
  writes rather than relying on a browser cookie.
- A missing or mismatched origin returns `403` and performs no session,
  persistence, or provider operation.
- New cookie-authenticated mutation routes must use the shared guard and add
  verifier coverage.

## Verification

- `scripts/verify-request-boundary.mjs`
- `npm run verify:persistence-runtime`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

