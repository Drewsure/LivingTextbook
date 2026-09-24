# DR-1139: Per-Asset Evidence Packets In Tenant Handoff

Decision: Carry validated metadata-only asset evidence packets into the tenant
evidence handoff before any attachment storage or promotion workflow exists.

- Preserve tenant, package, attachment, asset, and source-lineage identity.
- Preserve kind, MIME type, size, checksum, review status, and blocked actions.
- Validate every packet through the shared content-model contract.
- Keep raw bytes, URLs, uploads, storage writes, downloads, promotion,
  release mutation, assignment, and student-facing use blocked.

References: ADR 1139, Build session 1053, and the evidence handoff scope
verifier.
