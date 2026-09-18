# ADR 0847: Foundation Durable Persistence Gate

## Status

Accepted.

## Decision

Make durable progression storage, operational recovery, tenant-scoped teacher
operations authorization, and cross-route persistence part of the canonical
`verify:foundation` gate.

## Rationale

The platform now has a production-shaped server-only SQLite adapter and an
explicit non-durable rehearsal mode. Those are high-risk shared boundaries:
omitting them from the main foundation command would allow future changes to
break backup, restore, identity isolation, or route handoff while the ordinary
UI and schema checks remain green.

## Guardrails

- Durable provider selection remains deployment-configured and opt-in.
- Durable writes still require explicit write, school-policy, retention, and
  release-approval gates plus authorization.
- Operations remain server-only and teacher-review scoped.
- Backup and restore require checksums, integrity checks, and operation evidence.
- The rehearsal store remains visibly non-durable.

## Consequences

Every foundation verification now exercises the real persistence boundary. This
adds runtime cost to the gate, but it prevents a misleading green build in the
most sensitive part of the product. Cloud provider selection and production
deployment approval remain separate decisions.

See `docs/verification/FOUNDATION_DURABLE_PERSISTENCE_CHECKS.md` and
`docs/decision-register/DR-919-foundation-durable-persistence-gate.md`.
