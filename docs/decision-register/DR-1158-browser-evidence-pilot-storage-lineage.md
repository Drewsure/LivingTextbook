# DR-1158: Browser Evidence Pilot Storage Lineage

Decision: Preserve canonical storage-selection identity through composite
browser/privacy/tenant pilot and release bindings.

- Require non-empty storage preflight and gate IDs.
- Reject stale preflight or gate identity during pilot and release review.
- Keep pilot launch, hosted writes, student data collection, promotion, and
  release mutation blocked.

References: ADR 1158, Build session 1072, and the composite browser evidence
binding verification scripts.
