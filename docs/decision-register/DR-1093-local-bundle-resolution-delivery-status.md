# DR-1093: Local Bundle Resolution Delivery Status

- A resolver result now distinguishes `planning` from `offline-ready`.
- Route and asset consumers must not treat a planning resolution as playable
  local delivery.
- The offline-ready label is derived from the validated manifest, not from a
  UI toggle or a caller assertion.
- No file access, cache mutation, package write, offline activation, or
  learner-data persistence is enabled.

References: ADR 1093, Build session 1007, and the local bundle runtime
verification scripts.
