# DR-1344: Package-Scoped Hosted Persistence Activation Custody

Durable hosted progression and event writes require a server-side activation
record bound to the exact tenant and package, in addition to the shared
deployment, policy, release, and signed-session gates. The record names the
approved provider, hosted opt-in packet, release receipt, operator, and
activation timestamp while preserving route mutation and student-facing
activation as false.

Missing, malformed, tampered, cross-tenant, and cross-package records fail
closed. There is no browser writer for this record. The custody reader is
evidence for a future human/provider activation step and does not itself create
learner records or enable classroom launch.

Evidence: `packages/content-model/src/hostedPersistenceActivation.ts`,
`apps/web/src/server/persistence/hostedPersistenceActivationStore.ts`,
`scripts/verify-hosted-persistence-activation-custody.mjs`, and ADR 1345.
