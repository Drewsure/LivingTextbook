# DR-1006: Non-English Package Policy Gate

Decision: any non-English runtime target requires explicit package-level
target-language policy metadata.

Required invariants:

- Missing policy metadata fails closed for non-English target requests.
- English migration fixtures remain compatible.
- The policy gate runs before student-facing package use and does not itself
  approve, persist, or activate a package.

Evidence: `docs/adr/0934-non-english-package-policy-gate.md`,
`packages/content-model/src/contentPackageRuntime.ts`, and
`scripts/verify-runtime-behavior.mjs`.
