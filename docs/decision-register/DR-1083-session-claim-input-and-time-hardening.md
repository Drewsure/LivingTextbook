# DR-1083: Session Claim Input and Time Hardening

Status: Implemented; student session inputs and signed-session time windows
are bounded and fail closed.

Decision: Bound student launch identity fields before cookie creation and
reject future-issued, expired, or inverted student/teacher session claims.

Guardrails: A signed claim still requires tenant-scoped authorization; these
checks do not activate persistence, permit cross-tenant reads, or bypass
deployment policy.

Evidence: `apps/web/src/app/api/student/session/route.ts`,
`apps/web/src/server/persistence/studentSessionCookie.ts`,
`apps/web/src/server/persistence/teacherSessionCookie.ts`, and
`scripts/verify-persistence-read-authorization.mjs`.

