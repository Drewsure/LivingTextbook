# DR-1105: Asset Evidence Binding

Decision: Bind validated asset file metadata to the evidence packet flow before
future storage adapters are designed.

- Packets preserve tenant scope, asset identity, source lineage, kind, MIME
  type, byte length, checksum, and review status.
- Labelled Diagram and media teacher review surfaces expose representative
  metadata-first packets.
- Raw file bytes, storage URLs, downloads, uploads, promotion, playlist or
  game-manifest writes, and student-facing use remain blocked.
- Tenant mismatch and invalid file metadata are rejected without side effects.

References: ADR 1105, Build session 1019, and the content intake verification
checks.
