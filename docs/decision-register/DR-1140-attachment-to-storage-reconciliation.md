# DR-1140: Attachment-To-Storage Reconciliation

Decision: Reconcile each reviewed attachment with the provider-neutral storage
candidate set before any storage destination is selected.

- Preserve tenant, package, storage binding, asset packet, and attachment
  identities.
- Preserve unresolved policy gates and blocked action evidence.
- Keep provider selection, upload, download, promotion, release mutation,
  assignment, and student-facing use disabled.

References: ADR 1140, Build session 1054, and the evidence handoff scope
verifier.
