# DR-1164: Activation Preflight Scope

Decision: Preserve activation preflight tenant and package scope through the
deployment continuity handoff.

- Require explicit scope fields.
- Reject tenant or package drift.
- Keep activation, writes, export, installation, route mutation, and launch
  blocked.

References: ADR 1164, Build session 1078, and
`scripts/verify-deployment-continuity-handoff-storage-identity.mjs`.
