# DR-1088: Session Lifetime Bounds

Decision: Student sessions are capped at 24 hours and teacher review sessions
at 12 hours, with shorter configured windows supported.

Rationale: White-label classroom deployments need predictable session expiry;
positive-but-unbounded environment values are not a sufficient policy.

Scope: Current student and teacher session cookies and future signed session
types.

Verification: Creator and reader checks enforce the caps and the foundation
gate must pass before session lifetime changes are published.
