# DR-1155: Local Media Release-Control Storage Identity

Decision: Carry shared storage identity into the local media release-control
binding and block release review when it drifts.

- Require storage preflight and gate identity.
- Require explicit storage-match state.
- Keep promotion, package writes, local activation, student-facing use, and QR
  mutation blocked.

References: ADR 1155, Build session 1069, DR-1154, and the release-control
verification suite.
