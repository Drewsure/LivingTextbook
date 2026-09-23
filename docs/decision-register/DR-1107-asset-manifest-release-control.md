# DR-1107: Asset Manifest Release-Control Binding

Decision: Bind asset manifest previews to release-control evidence and hosted,
local, or hybrid deployment intent before any asset activation adapter exists.

- Preserve tenant, package, evidence, manifest, and release-gate identity.
- Expose deployment-policy, hosted-storage, local-bundle, release, and approval
  blockers.
- Keep storage, local activation, promotion, QR mutation, and student-facing
  use false.
- Do not infer approval from a path, folder, preview, or evidence-ready state.

References: ADR 1107, Build session 1021, and the content intake verification
checks.
