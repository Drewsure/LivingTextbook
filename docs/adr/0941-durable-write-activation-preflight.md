# ADR-0941: Durable-Write Activation Preflight

Status: Accepted for foundation hardening

## Decision

Aggregate the durable-write activation evidence into one teacher persistence
workbench preflight. The preflight is a read-only decision surface for a named
tenant and package. It must show passed, open, and blocked criteria without
providing an activation button or changing deployment state.

## Required invariants

- The preflight names the tenant, package, requested durable mode, evidence
  counts, and blocked reasons.
- Student-session identity, tenant-scoped teacher authorization, school policy,
  retention, release approval, operations, deployment configuration,
  minimization, and hosted/local parity are independently visible.
- A blocked or open criterion cannot be hidden by a summary status.
- The surface cannot activate a provider, write learner data, approve a school,
  or create a live assignment.
- The reference SQLite adapter remains implementation evidence, not automatic
  provider selection.

## Consequence

Teacher and publisher reviewers have one auditable answer to “can this pilot
accept durable writes?” while the platform keeps the safe default of no live
activation. The same packet can later be bound to a named hosted or local
deployment after policy and release evidence are approved.

Evidence: `apps/web/src/data/samplePersistenceActivationPreflight.ts`,
`apps/web/src/features/persistence/PersistenceActivationPreflightPanel.tsx`,
and `scripts/verify-persistence-activation-preflight.mjs`.
