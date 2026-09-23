# DR-1092: Session Secret Rollover

Decision: Session readers accept the current strong secret and one optional
previous strong secret; session creators always use the current secret.

Rationale: This supports safe white-label key rotation without creating an
unbounded fallback trust set.

Scope: Student and teacher signed sessions and future session types using the
shared secret policy.

Verification: Runtime rollover and weak-fallback regressions, persistence
authorization checks, and the full foundation gate must pass.
