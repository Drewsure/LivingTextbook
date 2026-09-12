# ADR-0610: Backend Track and Deployment Compatibility

Status: Accepted

## Decision

Every backend migration candidate must declare a track compatible with the
deployment fit of every schema entity it targets:

- `hosted-pilot` may target `hosted` or `hybrid` entities.
- `local-classroom` may target `local` or `hybrid` entities.
- `shared` may target any supported deployment fit.

The alignment validator rejects incompatible combinations before a migration
specification or adapter implementation can be treated as actionable.

## Why

The platform supports hosted, closed local, packaged-local, and hybrid
white-label deployments. A migration plan that mixes those boundaries without
declaring compatibility would create an avoidable implementation failure and
could break the local fallback promise.

## Guardrails

- This validates planning metadata only; it does not select or activate a
  storage adapter.
- Deferred candidates remain deferred even when their track is compatible.
- Tenant, retention, export, policy, and no-side-effect controls remain
  independently required.

## Consequences

Backend planning now carries an explicit deployment compatibility check. A
future deployment mode requires a deliberate update to the shared vocabulary,
compatibility logic, sample plans, tests, and documentation.
