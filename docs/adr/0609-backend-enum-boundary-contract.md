# ADR-0609: Backend Enum Boundary Contract

Status: Accepted

## Decision

The vendor-neutral backend alignment validator must validate all persisted
status, deployment, track, risk, and store-kind values at the JSON boundary.
Supported values are defined by the shared backend contract rather than being
trusted only because TypeScript source compiles.

## Why

Schema drafts, migration candidates, and migration specifications will
eventually be exchanged with hosted and local tooling. An unknown string can
otherwise enter through JSON, configuration, or an external adapter and
produce an invalid release or storage plan while appearing structurally valid.

## Guardrails

- This is validation only; it does not select a backend vendor or enable live
  persistence.
- Unsupported values fail before migration implementation or adapter review.
- Existing policy, tenant, retention, export, local-fallback, and no-side-
  effect rules remain independently required.

## Consequences

The backend contract has a deterministic runtime vocabulary for its control
records. Future additions must update the shared validator, sample records,
regression coverage, and documentation together.
