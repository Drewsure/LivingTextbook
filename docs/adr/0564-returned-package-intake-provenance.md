# ADR-0564: Returned Package Intake Provenance

Status: Accepted  
Date: 2026-09-11

## Decision

Align each returned prototype manifest with the original prototype intake
queue item. The queue item is the earliest review record and must agree with
the manifest on tenant, queue identity, approved repository, target mode, and
parent engine.

## Why

The return checklist describes what evidence is required, but the intake queue
explains why the candidate was selected and which engine boundary it belongs
to. Both links are needed to prevent a valid package from being attached to
the wrong request.

## Guardrails

- Provenance alignment is separate from checklist alignment and artifact
  completeness.
- A mismatch blocks future integration review.
- The gate does not authorize import, route replacement, scoring mutation,
  package promotion, or student assignment.

## Verification

The shared contract is
`packages/content-model/src/aiPrototypeReturnedPackageAlignment.ts`.
The review surface is
`apps/web/src/features/content-intake/AiPrototypeReturnedPackageManifestPanel.tsx`.
