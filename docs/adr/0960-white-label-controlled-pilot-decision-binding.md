# ADR 0960: White-Label Controlled Pilot Decision Binding

Status: Accepted

## Context

The platform already has a governed pilot review decision, but the white-label
release dashboard previously represented the controlled-pilot phase with
summary text only. That allowed the dashboard and the authoritative pilot
handoff to drift.

## Decision

Bind the release-readiness record to the pilot review decision through tenant,
package, decision, handoff routes, evidence bindings, blocker count, and
launch/data/report permissions. Keep pilot launch, learner data collection,
and report export false in this foundation slice.

## Consequences

- The release view exposes the actual pilot blocker state.
- Pilot evidence cannot be swapped across tenants or packages silently.
- A demo-ready package remains visibly distinct from a live classroom pilot.
- Future pilot approval work has one package-bound source to reconcile.

## Verification

- `node scripts/verify-white-label-release-readiness.mjs`
- `node scripts/verify-white-label-release-readiness-behavior.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes`
