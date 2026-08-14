# DR-443: AI Generated Package Promotion Checklist Validator

## Status

Accepted.

## Context

Generated package promotion checklists explain the future draft-to-playable pathway. They must help teachers and administrators review evidence without enabling promote buttons, route registry writes, media playlist writes, assignments, local bundles, student-ready markers, or support-language-only promotion.

## Decision

Add a shared `validateAiGeneratedPackagePromotionChecklist` guard in the content model and require the teacher generator route to show its active guard, guard blocks, and guard warnings.

The guard requires promotion steps, allowed review-only actions, blocked promotion actions, next records, audio approval, verifier, manifest, reward, release-control, approval, rollout, and support-language-only promotion blocks.

## Consequences

- Promotion checklists stay review-only until future release-control and package-writer gates exist.
- No promote button, route registry write, media playlist write, assignment write, local bundle write, or student-ready marker is enabled.
- Support-language-only promotion is blocked for every white-label tenant, with MiniStar Japanese support remaining hiragana-only and support-only.
