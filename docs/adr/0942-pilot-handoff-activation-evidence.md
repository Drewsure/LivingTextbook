# ADR-0942: Pilot Handoff Activation Evidence

Status: Accepted for controlled pilot preparation

## Decision

Bind the durable-write activation preflight into the canonical
`PilotHandoffPackage`. The handoff must carry the tenant, package, requested
durable mode, evidence counts, blocker reasons, and an explicit no-activation
flag alongside existing release, report, persistence, route, asset, and human
decision evidence.

## Required invariants

- Activation evidence is tenant- and package-scoped and must match the
  surrounding handoff identity.
- `requestedMode` is explicit and currently `durable-managed`.
- Passed, open, and blocked counts remain visible; blocked handoffs include
  blocker reasons.
- `canActivate` is permanently false in this review-only contract.
- The handoff cannot activate storage, approve a school, create an assignment,
  or accept learner data.

## Consequence

The pilot conversation now has one coherent package that explains the durable
write decision without turning review evidence into an operational switch.
Later activation work can consume this contract without duplicating or
silently weakening the existing persistence gates.

Evidence: `packages/content-model/src/pilotHandoff.ts`,
`apps/web/src/data/samplePilotHandoffPackage.ts`, and
`apps/web/src/features/pilot/PilotHandoffPackagePanel.tsx`.
