# DR-1154: Local Media Evidence Storage Identity

Decision: Bind local media evidence and media-manifest reconciliation to the
shared storage-selection preflight and evidence-storage gate identity.

- Require nonblank storage identity fields.
- Require blocked and disallowed storage state.
- Treat storage drift as a reconciliation mismatch.
- Keep media copy, package writes, activation, downloads, QR mutation, and
  student-facing promotion blocked.

References: ADR 1154, Build session 1068, DR-1153, and the local-bundle
verification suite.
