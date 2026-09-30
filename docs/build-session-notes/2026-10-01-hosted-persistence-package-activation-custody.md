# Build Session: Hosted Persistence Package Activation Custody

- Added a shared activation-record contract for hosted-managed and hybrid
  delivery modes.
- Added a server-side read-only custody reader keyed by tenant and package.
- Required durable progression and event writes to find the exact activation
  record after the existing deployment and authorization gates pass.
- Added hosted/hybrid deployment-preflight visibility for the activation root.
- Preserved rehearsal-only writes, browser mutation blocking, route mutation
  blocking, student-facing activation blocking, and the frozen Z.ai/Phaser
  isolation boundary.

Evidence: `scripts/verify-hosted-persistence-activation-custody.mjs` and
`scripts/verify-persistence-deployment-gate-alignment.mjs`.
