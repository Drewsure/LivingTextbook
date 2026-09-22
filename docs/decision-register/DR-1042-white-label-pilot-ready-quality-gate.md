# DR-1042: White-label Pilot-ready Quality Gate

Decision: a white-label readiness record cannot claim `pilot-ready` unless all
seven quality signals and all seven quality evidence records are verified.

Required invariants:

- Typecheck, production build, active routes, runtime, browser, privacy, and
  tenant isolation must all be true.
- Each corresponding quality evidence record must be verified.
- A failed quality lane rejects `pilot-ready` even when phases are marked
  ready.
- This gate does not authorize production approval, persistence activation,
  package promotion, or student launch.

Evidence: `packages/content-model/src/whiteLabelReleaseReadiness.ts`,
`scripts/verify-white-label-release-readiness-behavior.mjs`, and
`docs/adr/0970-white-label-pilot-ready-quality-gate.md`.
