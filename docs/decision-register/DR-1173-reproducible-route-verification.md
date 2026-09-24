# DR-1173: Reproducible Production-Preview Route Verification

The active-route browser gate runs through a cross-platform production-preview
wrapper on a free local port. It waits for readiness, passes the configured
base URL to the existing 89-route verifier, preserves route failures, and
cleans up the preview process with non-blocking Windows process-tree
termination. The check remains read-only and cannot enable
storage, student launch, package promotion, or tenant mutation. Evidence:
`scripts/verify-routes-with-preview.mjs` and `verify:routes:preview`.
