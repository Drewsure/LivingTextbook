# DR-1161: Deployment Continuity Handoff Storage Identity

Decision: Preserve continuity storage identity explicitly through the hosted,
local, and packaged deployment handoff artifacts.

- Require storage preflight and gate fields.
- Require both storage evidence bindings.
- Keep export, installation, activation, route mutation, writes, and launch
  blocked.

References: ADR 1161, Build session 1075, and
`scripts/verify-deployment-continuity-handoff-storage-identity.mjs`.
