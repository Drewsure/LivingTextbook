# DR-1005: Content Package Target-Language Binding

Decision: package metadata must be able to preserve the target-language policy
that its content and audio were reviewed against, and runtime requests must
match that binding.

Required invariants:

- A declared package policy requires an explicit package target language.
- Package policy language must match package target language and tenant scope.
- Support-language progress remains disabled.
- Runtime target language must match the package target language.
- Optional metadata keeps the migration compatible with existing English
  fixtures while future packages adopt the binding.

Evidence: `docs/adr/0933-content-package-target-language-binding.md`,
`packages/content-model/src/index.ts`,
`packages/content-model/src/contentPackageRuntime.ts`, and
`scripts/verify-runtime-behavior.mjs`.
