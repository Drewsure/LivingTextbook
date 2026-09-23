# DR-1089: Session Cookie Emission Bounds

Decision: Student and teacher cookie emitters produce a finite, non-negative
`Max-Age` bounded by the declared session lifetime. Invalid expiration input
emits `Max-Age=0`.

Rationale: The browser boundary must fail closed even when a future internal
caller bypasses route-level session construction.

Scope: Current signed student and teacher session cookie emitters and future
session-bearing cookie helpers.

Verification: Persistence authorization checks and the full foundation gate
must pass before this policy is published.
