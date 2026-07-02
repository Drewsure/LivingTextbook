# DR-038: Pilot Handoff Package

Date: 2026-07-03

## Decision

Add a pilot handoff package layer to the teacher/admin intake surface. This layer summarizes the partner-facing routes, assets, open decisions, owners, costs, and handoff notes needed to move from static demo to controlled pilot.

## Rationale

The project needs a credible answer for textbook partners without overpromising a complete commercial product. A handoff package makes the current state inspectable: what can be shown now, what needs review, what is blocked by policy or persistence, and what the partner must provide.

## Consequences

- `/teacher/intake` now includes a practical handoff panel below the pilot readiness gate.
- The first recommended path remains hosted PWA for cost control.
- Local/closed deployment remains visible but deferred until backup, updates, export, and route behavior are designed.
- AI Tutor remains optional premium scope, not part of the core pilot promise.
- Durable student reports remain blocked until persistence and policy gates are closed.

## Files

- `apps/web/src/data/samplePilotHandoffPackage.ts`
- `apps/web/src/features/pilot/PilotHandoffPackagePanel.tsx`
- `docs/PILOT_HANDOFF_PACKAGE_CONTRACT.md`
- `docs/verification/PILOT_HANDOFF_PACKAGE_CHECKS.md`
