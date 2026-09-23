# DR-1084: Session Sign-out Origin Hardening

Decision: Student and teacher session DELETE routes must require the shared
exact-origin mutation boundary before clearing cookies.

Rationale: Session issuance and sign-out are both cookie mutations. Keeping
the same-origin policy symmetric reduces CSRF exposure and prevents a future
session route from silently introducing a weaker mutation path.

Scope: Current student and teacher session routes only. The rule is a standing
requirement for future session-bearing routes.

Verification: `scripts/verify-persistence-read-authorization.mjs` checks both
routes, and `npm run verify:persistence-runtime` plus `npm run verify:foundation`
must pass.
