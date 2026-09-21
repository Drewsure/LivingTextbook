# DR-1010: Japanese Target-Tenant Preview Boundary

Decision: represent Japanese-learning white-label demand as a blocked,
teacher-visible tenant preview until a reviewed Japanese package and runtime
evidence exist.

Required invariants:

- The Japanese tenant is not an active front-door route.
- No Japanese package is treated as student-ready by the preview.
- Japanese target-language events, not English support, are the only possible
  future progression trigger.
- Audio approval, script policy, segmentation, and curriculum review remain
  explicit blockers.
- Preview evidence cannot create assignments, progress, or release state.

Evidence: `docs/adr/0938-japanese-target-tenant-preview.md`,
`apps/web/src/data/sampleTargetLanguageTenantPreview.ts`, and
`scripts/verify-target-language-tenant-preview.mjs`.
