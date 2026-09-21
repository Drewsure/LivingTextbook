# ADR 0934: Non-English Package Policy Gate

## Decision

Content package runtime validation must reject a non-English target language
unless the package carries an explicit `targetLanguagePolicy` binding.

## Rationale

Language expansion cannot be safe when the runtime infers Japanese, French, or
another target from a route request while the package remains authored under
English assumptions. The package policy is the minimum evidence that script,
segmentation, audio, and progression responsibilities were considered.

## Constraints

- English migration fixtures remain compatible.
- Non-English packages fail closed before student-facing use if policy metadata
  is absent.
- This gate does not mark a package approved or enable Japanese gameplay.

## Evidence

- `packages/content-model/src/contentPackageRuntime.ts`
- `scripts/verify-runtime-behavior.mjs`
- `scripts/verify-content-package-runtime.mjs`
