# DR-1142: Deployment Continuity Storage Review Binding

Decision: Carry the exact storage selection preflight and evidence-storage gate
into deployment continuity review.

- Preserve tenant/package scope and storage review identity.
- Keep storage selection blocked and side-effect-free.
- Do not let deployment recommendation, recovery rehearsal, local preview, or
  packaged companion planning activate a provider, persistence, offline mode,
  QR route, or classroom launch.

References: ADR 1142, Build session 1056, and the deployment decision workbench
verification gate.
