# ADR 1082: Web Security Header Baseline

## Decision

The web application applies a deployment-wide header baseline through
`apps/web/next.config.ts`:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`
- `Permissions-Policy: microphone=(self), camera=(), geolocation=()`

The baseline permits microphone use only on the application origin because
teacher-approved speech features are part of the product. Camera and
geolocation are disabled. A rigid Content-Security-Policy is deferred until
tenant-approved media and CDN origins are represented in the white-label
contract.

## Rationale

The platform handles learner progress, teacher sessions, uploaded media, and
optional microphone features. These defaults reduce browser-level exposure
without blocking the planned speech lane or assuming that every tenant uses
the same asset host.

## Consequences

- v1 embedding remains same-origin only while cross-origin embeds are blocked.
- A future approved embed or media CDN must update the tenant security policy
  and verifier together; it must not weaken headers ad hoc.
- The headers do not replace route authorization, tenant isolation, or
  persistence policy gates.

## Verification

- `scripts/verify-web-security-headers.mjs`
- `npm run verify:web-security-headers`
- `npm run build --workspace @living-textbook/web`

