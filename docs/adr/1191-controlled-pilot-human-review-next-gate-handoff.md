# ADR 1191: Controlled-Pilot Human-Review Next-Gate Handoff

## Status

Accepted for foundation implementation; review-only.

## Context

The controlled-pilot human-review adjudication can record either blocked
evidence or evidence accepted for a next review gate. Without a separate
handoff contract, downstream surfaces would need to infer whether the outcome
may advance, which risks turning a review note into release authority.

## Decision

Add a tenant- and package-bound next-gate handoff record derived only from the
validated human-review adjudication. It carries exact evidence references,
recipient role, blockers, required next records, and the next review gate.

The derived status is either `blocked` or `ready-for-next-gate`. The latter is
evidence routing only. It is never approval, persistence authorization, release
mutation, package promotion, local activation, or student launch permission.

## Consequences

- Release-control can show the same evidence lineage as a next review surface.
- Cross-route review handoff no longer depends on UI inference or labels.
- A future approval design must be separately authorized and revalidate tenant,
  package, storage, and reviewer identity.
- The sample remains blocked until upstream evidence is genuinely accepted.

## Verification

`scripts/verify-controlled-pilot-human-review-next-gate-handoff.mjs` checks
derived status, identity carriage, required evidence references, and blocked
operational actions. No workflow action or durable write is introduced.
