# DR-1030: White-Label Release Readiness

Decision: provide one tenant-scoped, evidence-led release-readiness view for
the saleable platform while keeping production approval and student launch
disabled.

Required invariants:

- Eight governed phases are present and status-derived.
- Typecheck, build, route, runtime, browser, privacy, and tenant-isolation
  signals remain separate from approval.
- MiniStar is a flagship tenant, not a universal platform dependency.
- Provider activation, learner data collection, package promotion, QR
  mutation, public publishing, and student launch remain blocked.

Evidence: `docs/adr/0958-white-label-release-readiness.md`,
`packages/content-model/src/whiteLabelReleaseReadiness.ts`,
`apps/web/src/data/sampleWhiteLabelReleaseReadiness.ts`, and
`scripts/verify-white-label-release-readiness.mjs`.
