# ADR-0566: Returned Package Readiness Separation

Status: Accepted  
Date: 2026-09-12

## Decision

The prototype intake readiness summary derives its returned-package contract
lane from manifest, checklist, intake, and surface validators, but keeps actual
returned-package availability as a separate lane.

## Why

Preview records are useful for designing and testing the review workflow, but
they are not evidence that Z.ai has returned source or that Codex has reviewed
it. Combining those states would make the integration alert unreliable.

## Guardrails

- Contract validity can be ready while package availability remains missing.
- The summary cannot issue the Z.ai/Codex alert from preview data.
- Replay, wrapper, release, import, scoring, package, and assignment actions
  remain blocked.

## Verification

The derived summary is
`apps/web/src/data/samplePrototypeIntakeReadinessSummary.ts`.
The visible review surface is
`apps/web/src/features/game-offers/PrototypeIntakeReadinessSummaryPanel.tsx`.
