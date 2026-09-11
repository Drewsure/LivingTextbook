# ADR-0562: Returned Package Checklist Alignment

Status: Accepted  
Date: 2026-09-11

## Decision

Validate each returned prototype manifest against its tenant-scoped return
package checklist before considering future Codex integration review.

The alignment contract compares tenant ID, queue item ID, approved source
repository, target mode, parent engine, and review status. A manifest marked
`review-only` requires a checklist marked `ready-for-return-review`.

## Why

The manifest and checklist are separate records for good reasons: the manifest
describes an actual returned package, while the checklist describes the review
requirements. Without an alignment gate, they could each pass independently
while referring to different prototype work.

## Guardrails

- Mismatched identity or mode data blocks alignment.
- Checklist alignment does not imply that required artifacts are present.
- The gate does not authorize import, route replacement, scoring mutation,
  package promotion, or student assignment.

## Verification

The shared contract is
`packages/content-model/src/aiPrototypeReturnedPackageAlignment.ts`.
The review panel is
`apps/web/src/features/content-intake/AiPrototypeReturnedPackageManifestPanel.tsx`.
Run `npm run verify:prototype-review`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation` after changes.
