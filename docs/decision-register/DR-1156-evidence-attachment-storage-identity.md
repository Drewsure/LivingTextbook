# DR-1156: Evidence Attachment Storage Identity

Decision: Bind evidence attachment storage reconciliation and handoff to the
shared storage-selection preflight and evidence-storage gate identity.

- Require non-empty preflight and gate IDs.
- Reject handoff identity drift.
- Keep upload, download, promotion, signed approval, activation, and release
  mutation blocked.

References: ADR 1156, Build session 1070, DR-1155, and
`scripts/verify-evidence-storage-reconciliation.mjs`.
