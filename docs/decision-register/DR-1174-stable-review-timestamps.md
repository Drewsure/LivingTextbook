# DR-1174: Stable Review Timestamps

- **Decision:** Render governed teacher/reviewer timestamps with one explicit
  UTC formatter.
- **Reason:** Prevent SSR hydration differences and keep evidence packets
  unambiguous across school locales.
- **Scope:** Teacher session evidence, browser adjudication, privacy/tenant
  evidence adjudication, and teacher operations-access expiry text.
- **Non-goals:** This does not localize learner content, alter event storage,
  enable hosted persistence, or change release authority.
- **Verification:** `npm run verify:review-keys` plus the full foundation gate.
