# DR-1091: Session Secret Strength Policy

Decision: Signed student and teacher session secrets require at least 32 UTF-8
bytes through one shared server-side policy.

Rationale: Presence-only configuration is too weak for a saleable multi-tenant
deployment and can mistake example placeholders for operational readiness.

Scope: Session creation, session parsing, persistence deployment readiness, and
future signed-session types.

Verification: Runtime weak/strong-secret regression, persistence authorization
checks, and the full foundation gate must pass before publication.
