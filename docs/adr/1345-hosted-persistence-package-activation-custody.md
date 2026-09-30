# ADR 1345: Hosted Persistence Package Activation Custody

## Status

Accepted for foundation hardening.

## Context

The hosted persistence routes already require a configured SQLite provider,
deployment policy, school and retention acceptance, release approval, signed
student identity, and reviewed event taxonomy. Those controls are necessary
but global. They did not yet prove that a particular tenant/package had a
separately reviewed hosted opt-in and release custody record.

## Decision

Add a server-side, read-only activation custody reader. Durable progression and
event writes must find a valid `activation.json` under
`LIVING_TEXTBOOOK_HOSTED_PERSISTENCE_ACTIVATION_ROOT/<tenant>/<package>/`.
The record must bind the tenant, package, delivery version, release receipt,
hosted persistence decision packet, approved SQLite provider, policy approvals,
and operator timestamp. It must explicitly keep route mutation and
student-facing activation false.

The browser cannot create or modify this record. Missing or invalid custody
continues to return a blocked response. Rehearsal writes remain governed by
their existing explicit non-durable gate and do not consult this durable
activation record.

## Consequences

- Durable hosted writes are package-scoped rather than merely deployment-scoped.
- A future operator/provider activation step has a precise evidence artifact.
- No new learner-data path, browser mutation, classroom launch, or provider
  activation is enabled by this decision.
- Deployment preflight now reports the hosted activation custody root as a
  required hosted/hybrid configuration item.

## Verification

`scripts/verify-hosted-persistence-activation-custody.mjs` covers missing,
valid, tampered, tenant-drifted, and package-drifted records. The persistence
deployment alignment verifier protects both write routes and the custody root.
