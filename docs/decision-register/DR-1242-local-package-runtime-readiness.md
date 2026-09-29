# DR-1242: Local Package Runtime Readiness

- **Status:** Accepted
- **Date:** 2026-09-29
- **Decision:** Add a disabled-by-default, metadata-only local package runtime
  reader and bounded status route.
- **Why:** The package assembler needs a corresponding read-side contract so a
  local app can prove it can open an approved package and resolve its curated
  routes without exposing payload bytes or learner data.
- **Guardrails:** Require the explicit local-package read flag and configured
  root; validate all approved metadata and cross-record identities; return only
  a route/media/QR readiness summary; never write, mutate aliases, activate
  students, enable hosted persistence, or include learner records.
- **Acceptance evidence:** Focused reader verifier, foundation-composition
  verifier, typecheck, and production build pass.
- **Follow-up:** Rehearse with a real publisher package only after the publisher
  supplies rights, accessibility, media, rollback, and release evidence.

