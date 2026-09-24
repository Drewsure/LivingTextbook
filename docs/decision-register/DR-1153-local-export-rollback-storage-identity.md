# DR-1153: Local Export and Rollback Storage Identity

Decision: Bind local export/retention and package rollback dry runs to the
shared storage-selection preflight and evidence-storage gate identity.

- Require nonblank storage identity fields.
- Require blocked and disallowed storage state.
- Keep export, deletion, file copy, package writes, route mutation, and
  rollback execution blocked.

References: ADR 1153, Build session 1067, DR-1152, and the local-bundle
verification suite.
