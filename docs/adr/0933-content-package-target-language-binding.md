# ADR 0933: Content Package Target-Language Binding

## Decision

Content package metadata may carry an explicit target language, assist-language
list, and `targetLanguagePolicy`. When present, the package validator checks the
policy against the package tenant, and the package runtime checks the package
target language against the runtime target language.

## Rationale

Tenant settings alone are not enough evidence for a released textbook package.
The package must preserve the language role that its units, audio, text
segmentation, and review records were authored against. This also prevents a
Japanese package from silently inheriting English runtime assumptions.

## Constraints

- Existing English packages remain compatible while the metadata is optional
  during the migration scaffold.
- A package that declares a policy must also declare its target language.
- Target-language audio and support-language progress rules remain enforced.
- A package/runtime target-language mismatch fails closed.
- This is validation only; it does not activate a route, persist records, or
  approve a pilot.

## Evidence

- `packages/content-model/src/index.ts`
- `packages/content-model/src/contentPackageRuntime.ts`
- `scripts/verify-runtime-behavior.mjs`
- `scripts/verify-content-package-runtime.mjs`
