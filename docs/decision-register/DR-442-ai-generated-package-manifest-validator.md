# DR-442: AI Generated Package Manifest Validator

## Status

Accepted.

## Context

Generated package manifests are the bridge between AI draft review and future package assembly. They must preserve lineage and required storage records without enabling package assembly, route registry writes, media playlist writes, assignments, local bundles, student-ready markers, or support-language-only package assembly.

## Decision

Add a shared `validateAiGeneratedPackageManifest` guard in the content model and require the teacher generator route to show its active guard, guard blocks, and guard warnings.

The guard requires manifest links, package records, release locks, blocked actions, next requirements, target-language audio approval lineage, media-rights evidence needs, teacher approval records, and support-language-only assembly blocks.

## Consequences

- Generated package manifests stay review-only until future writer and release-control gates exist.
- No package assembly, route registry write, media playlist write, assignment creation, local bundle write, or student-ready marker is enabled.
- Support-language-only package assembly is explicitly blocked for white-label tenants, including MiniStar Foundation/Bronze/Plus Japanese support.
