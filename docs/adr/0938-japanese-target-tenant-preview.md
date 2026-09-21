# ADR-0938: Japanese Target-Tenant Preview Boundary

Status: Accepted

## Decision

Represent the Japanese-learning white-label opportunity as a teacher/admin
preview before registering a student route or creating a live Japanese package.
The preview binds a tenant configuration, target-language progression rule,
and explicit readiness gates, while keeping route registration, package
creation, assignment, speech activities, and progress activation blocked.

## Rationale

Japanese schools are a plausible white-label tenant, but a tenant fixture is
not a curriculum release. Japanese target content needs reviewed curriculum,
target-language audio, language-aware segmentation, and level-specific script
rules. A visible preview lets the platform prove configurability without
silently turning English support or unfinished Japanese behavior into learner
mastery.

## Consequences

- Teacher intake can show the opportunity and its current blockers.
- The Japanese tenant remains outside the active front-door registry.
- No fake student route or unreviewed Japanese package is introduced.
- Future Japanese package work must satisfy the existing content, audio,
  script, segmentation, persistence, and release gates.

Evidence: `apps/web/src/data/sampleTargetLanguageTenantPreview.ts`,
`apps/web/src/features/language/TargetLanguageTenantPreviewPanel.tsx`, and
`scripts/verify-target-language-tenant-preview.mjs`.
