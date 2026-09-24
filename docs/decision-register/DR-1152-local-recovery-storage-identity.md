# DR-1152: Local Recovery Storage Identity

Decision: Bind local provider approval and recovery packets to the same storage
selection identity and reject storage-gate drift during reconciliation.

- Require nonblank preflight and gate identifiers.
- Require blocked and disallowed storage state.
- Keep backup, restore, export, retention deletion, activation, route
  mutation, package writes, and student promotion blocked.

References: ADR 1152, Build session 1066, DR-1151, and the local recovery
reconciliation verifier.
