# DR-1143: Pilot Handoff Storage Selection Review Binding

Decision: Carry the exact storage-selection preflight and evidence-storage gate
into the controlled pilot handoff.

- Preserve tenant/package scope across evidence, deployment, and pilot review.
- Keep hosted, closed-local, and hybrid comparison paths visible but
  provider-neutral.
- Keep selection, migration, writes, activation, offline claims, upload,
  download, QR mutation, release mutation, and classroom launch blocked until
  human policy review passes.

References: ADR 1143, Build session 1057, and the pilot handoff verification
gates.
