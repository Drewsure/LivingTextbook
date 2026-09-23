# DR-1108: Cross-Deployment Persistence Recovery Rehearsal

Decision: Compare hosted-managed, closed-local, and hybrid recovery paths with
one tenant/package-bound, provider-neutral rehearsal before selecting a
provider or enabling persistence.

- Require backup, restore, export, retention, rollback, tenant-isolation, and
  raw learner-data exclusion evidence for every path.
- Reconcile provider selection, persistence handoff, and local recovery source
  records without silently repairing identity drift.
- Keep provider selection, writes, backup, restore, export, package promotion,
  QR mutation, and route mutation blocked.

References: ADR 1108, Build session 1022, and the content intake verification
checks.
