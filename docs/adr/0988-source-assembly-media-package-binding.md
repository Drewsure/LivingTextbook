# ADR 0988: Source Assembly Media-Package Binding

## Decision

Require candidate media asset IDs in a source package assembly to resolve to
the same tenant- and package-scoped content package before readiness evidence
can consume those references.

## Boundaries

- A reference is not an upload, copy, rights approval, playlist activation,
  local bundle write, or student-facing permission.
- Cross-tenant, missing, and out-of-unit media references fail closed.
- Existing media rights, accessibility, release, and deployment gates remain
  independently required.

## Rationale

Text extraction and multimedia intake are one publisher workflow. Binding them
at the assembly boundary prevents a package from appearing complete while its
media references point to another tenant, package, or unit.

Evidence: `packages/content-model/src/sourcePackageAssembly.ts`,
`apps/web/src/data/sampleSourcePackageAssembly.ts`, and
`scripts/verify-runtime-behavior.mjs`.
