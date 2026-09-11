# ADR-0561: Returned Prototype Manifest

Status: Accepted  
Date: 2026-09-11

## Decision

Require each external prototype return to provide a typed, review-only
manifest. The manifest binds the return to the approved repository, immutable
source snapshot, queue item, target mode, parent engine, and separate source,
fixture, README, event, audio, scoring, mobile, and wrapper artifacts.

## Why

The existing checklist states what a builder should return, but a checklist
alone cannot reject an unpinned branch, an unsafe path, or a package that
quietly points into the application. A manifest creates a machine-checkable
boundary before Codex reviews a DOM or Phaser wrapper.

## Guardrails

- The initial approved repository is `Drewsure/ministar-lab`.
- `latest`, `main`, unsafe relative paths, and `apps/web` or `apps/ai-service` source paths are rejected.
- Review-only advancement requires all named evidence artifact kinds.
- The manifest does not authorize source import, route replacement, scoring
  mutation, package promotion, or student assignment.

## Verification

The shared contract is
`packages/content-model/src/aiPrototypeReturnedPackageManifest.ts`.
The preview surface is
`apps/web/src/features/content-intake/AiPrototypeReturnedPackageManifestPanel.tsx`.
Run `npm run verify:foundation` after changes.
