# DR-1245: Local Canonical Memory Match Route

- **Status:** Accepted
- **Date:** 2026-09-29
- **Decision:** Bind the first local student game route to the approved local
  content reader and the existing canonical Memory Match engine.
- **Why:** This proves that a local publisher package can reach a real game
  without duplicating scoring, audio, or progression logic.
- **Guardrails:** Require the content reader, package-bound identity, approved
  review status, target-language audio, and completed entry-practice state;
  keep hosted persistence activation, QR mutation, learner records, and
  release-state changes outside the route.
- **Acceptance evidence:** Focused route verifier, foundation composition,
  typecheck, and production build.
- **Follow-up:** Add the package front-door route and local flashcard entry
  screen before calling the local student journey complete.

