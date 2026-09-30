# DR-1314: Tenant-Bound Teacher Authoring Shell

Date: 2026-09-30
Status: Accepted

The teacher authoring route now resolves the visual and navigation shell from
the draft's tenant identity instead of always rendering the Sample Publisher
tenant. Unknown tenant identities fail closed. This prevents cross-tenant
branding and policy leakage while preserving the review-only draft boundary.
See ADR 1315.
