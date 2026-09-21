# DR-1004: Explicit Target-Language Policy Contract

Decision: represent target-language progression responsibility separately from
support-language configuration in the shared content model.

Required invariants:

- A tenant target language must match the policy language.
- Assist languages must be distinct from the target language.
- Target-language audio is required.
- Support-language progress remains disabled.
- Japanese target packages require Japanese-aware or tenant-defined
  segmentation and a reviewed Japanese script policy.
- The reference Japanese tenant is evidence of configurability, not pilot
  approval.

Evidence: `docs/adr/0932-target-language-policy-contract.md`,
`packages/content-model/src/targetLanguagePolicy.ts`,
`apps/web/src/features/tenant/sampleJapaneseTenant.ts`, and
`scripts/verify-target-language-policy.mjs`.
