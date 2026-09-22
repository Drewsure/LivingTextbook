# DR-1032: White-Label Controlled Pilot Decision Binding

Decision: bind the white-label release-readiness record to the authoritative
controlled-pilot review decision for the same tenant and package.

Required invariants:

- Decision identity, handoff routes, evidence bindings, tenant, and package
  must remain aligned.
- Blocker count must match blocker reasons.
- Pilot launch, learner data collection, and report export remain false until
  later governed approval work closes the required gates.
- A demo-ready status must never be presented as a live classroom pilot.

Evidence: `docs/adr/0960-white-label-controlled-pilot-decision-binding.md`,
`packages/content-model/src/whiteLabelReleaseReadiness.ts`,
`apps/web/src/data/sampleWhiteLabelReleaseReadiness.ts`, and
`scripts/verify-white-label-release-readiness-behavior.mjs`.
