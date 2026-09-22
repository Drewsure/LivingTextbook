# ADR 0997: Explicit Pilot Deployment Decision Record

Status: Accepted for review-only implementation

## Context

The platform already compares hosted PWA, local classroom server, and packaged
companion deployment options. A comparison guide alone is not enough for a
controlled pilot: the selected tenant and package need an explicit decision
record, while the platform must avoid treating a recommendation as approval.

## Decision

Add a tenant- and package-bound pilot deployment decision record. It recommends
the hosted PWA option for the first low-cost pilot, but leaves the selected
option unset until a human school or publisher owner decides. The record stays
review-only and explicitly blocks persistence activation and classroom launch.

## Consequences

- Pilot conversations have one clear deployment decision identity.
- Hosted, local, and packaged options remain visible for white-label sales.
- A recommendation cannot silently become a provider selection or launch.
- Future selection workflows must preserve policy, authorization, retention,
  release, operations, cost, and local-fallback evidence.

Evidence: `packages/content-model/src/pilotDeploymentDecision.ts`,
`apps/web/src/data/samplePilotDeploymentDecision.ts`,
`apps/web/src/features/pilot/PilotDeploymentDecisionPanel.tsx`, and
`scripts/verify-pilot-deployment-decision.mjs`.
