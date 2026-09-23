# DR-1090: Session Cookie Emission Runtime Regression

Decision: The persistence runtime gate executes the real student and teacher
cookie emitters and validates their `Set-Cookie` output.

Rationale: Static markers cannot prove secure attributes, numeric lifetime
bounds, or fail-closed behavior for invalid expiration input.

Scope: Current signed student and teacher cookie emitters and future session
cookie helpers.

Verification: `npm run verify:persistence-runtime` and the full foundation gate
must pass before the policy is published.
