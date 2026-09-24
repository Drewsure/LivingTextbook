# DR-1151: Recovery Rehearsal Storage Identity

Decision: Carry provider storage-selection identity into the cross-deployment
recovery rehearsal and reject identity drift at the deployment-continuity
boundary.

- Require the recovery rehearsal to remain blocked and disallowed.
- Require continuity preflight and gate identifiers to match the rehearsal.
- Keep backup, restore, export, writes, route mutation, promotion, and
  classroom launch blocked.

References: ADR 1151, Build session 1065, DR-1150, and the runtime behavior
verification harness.
