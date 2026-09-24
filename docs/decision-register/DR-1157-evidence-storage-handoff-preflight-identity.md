# DR-1157: Evidence Storage Handoff Preflight Identity

Decision: Carry storage-selection preflight identity into the evidence storage
handoff binding and reject package handoff drift.

- Require non-empty preflight identity.
- Match packet, binding, and reconciliation identity.
- Keep all evidence storage and release side effects blocked.

References: ADR 1157, Build session 1071, DR-1156, and the evidence handoff
verification suite.
