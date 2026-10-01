# DR-1408: Local Package Operator Behavior Test

- **Decision:** Add an HTTP-backed self-test for the closed-local package
  operator and include it in foundation composition.
- **Reason:** Static checks cannot prove route selection, authorization headers,
  bounded identity forwarding, or the no-request assembly confirmation gate.
- **Boundary:** The self-test uses a local stub only; it does not write a
  package, mutate QR aliases, activate persistence, or create learner records.
- **Verification:** `npm run verify:local-package-operator-behavior` and
  `npm run verify:foundation-composition`.
