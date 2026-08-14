# DR-445: AI Generated Package Release Candidate Validator

## Status

Accepted.

## Context

Generated package release candidates are the bridge from AI review evidence into a future private tenant library and normal release-control workflow. They must remain preview-only until private-library, release candidate, approval, assignment, local bundle, and student-ready gates exist.

## Decision

Add a shared `validateAiGeneratedPackageReleaseCandidate` guard in the content model and require the teacher generator route to show its active guard, guard blocks, and guard warnings.

The guard requires manifest, promotion checklist, publish readiness, private-library target, release candidate target, student-facing release blocker, candidate records, next records, review-only allowed actions, blocked release actions, and tenant-specific language boundaries.

## Consequences

- Release candidates stay review-only until future private-library and release-control gates exist.
- No private-library publish, release candidate write, tenant library item write, student-facing release, assignment write, local bundle release, or student-ready marker is enabled.
- Support-language-only release remains blocked for every white-label tenant, with MiniStar Japanese support remaining hiragana-only and support-only.
