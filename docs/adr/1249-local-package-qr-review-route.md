# ADR 1249: Local Package QR Review Route

## Decision

Add a tenant/package/version/QR-scoped review route for the local companion.
It reads the verified package runtime manifest, displays the printed identity
and declared local fallback, and allows a reviewer to open that fallback.

## Boundaries

The route is read-only. It does not resolve or mutate the hosted QR alias
registry, authorize print, activate students, write package files, enable
hosted persistence, or expose learner records. A successful mapping review is
not a release approval.

## Rationale

The saleable white-label pilot needs evidence that a printed textbook identity
maps to the intended package route. Keeping this mapping review inside the
verified package scope avoids a generic sample route and makes the local
companion testable without prematurely opening deployment side effects.
