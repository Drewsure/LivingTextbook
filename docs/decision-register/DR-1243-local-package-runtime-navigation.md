# DR-1243: Local Package Runtime Navigation

- **Status:** Accepted
- **Date:** 2026-09-29
- **Decision:** Provide a tenant-branded, parameterized read-only route for an
  assembled local pilot package.
- **Why:** An API-only reader is insufficient for teacher/publisher rehearsal;
  the local companion needs a visible handoff that exposes verified navigation
  without becoming an activation workflow.
- **Guardrails:** Use the shared runtime reader, allow only bounded package
  paths, show package-declared QR fallbacks and game paths, and keep writes,
  learner records, hosted persistence activation, QR mutation, student
  activation, and release changes outside the route.
- **Acceptance evidence:** Focused route verifier, foundation composition,
  typecheck, and production build.
- **Follow-up:** Extend the tenant registry and exercise the route with a real
  publisher package after release evidence is accepted.

