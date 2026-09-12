# ADR 0677: Progression Continuity Persistence Boundary

## Decision

Represent route handoff continuity as a separate provider-neutral
`progression-continuity` record in the durable-record plan, backend schema
draft, migration candidates/specification, and hosted/local adapter maps.
Keep every implementation path policy-gated until the backend, identity,
retention, reporting, recovery, and school/tenant policy decisions are
accepted.

## Rationale

Continuity is not the same data shape as an append-only learning event. It is a
compact, validated handoff containing source and destination routes, a
monotonic cursor, and a progression snapshot. Naming it separately makes the
future storage decision explicit without giving a client URL or runtime handoff
authority over scoring, unlocks, Star Dust, or rewards.

## Guardrails

- Tenant, package, launch, learner, route, and cursor identity remain required.
- Raw learner audio, transcripts, URL state, and cross-tenant reuse remain forbidden.
- Hosted and local maps use the same contract and export-safe shape.
- Review-only runtime decisions remain evidence, never storage activation.
- Stale, reordered, cross-package, and direct side-effect handoffs remain
  blocked.

## Consequence

Backend comparison and local companion planning can now account for route
continuity without inventing a provider-specific implementation. Any future
adapter must satisfy the shared record and runtime validators before pilot
storage is considered.
