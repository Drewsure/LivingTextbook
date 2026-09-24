# DR-1159: Controlled Pilot Storage Reconciliation

Decision: Reconcile storage identity across provider selection, the canonical
pilot decision, and the composite evidence release binding before controlled
pilot human-review eligibility.

- Reject storage identity drift as a release-control blocker.
- Keep storage selection blocked and disallowed in the review-only runtime.
- Keep approval capture, release mutation, student launch, hosted writes, and
  student data collection disabled.

References: ADR 1159, Build session 1073, and
`scripts/verify-controlled-pilot-approval-readiness.mjs`.
