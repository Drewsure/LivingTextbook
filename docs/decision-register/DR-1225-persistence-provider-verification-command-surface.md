# DR-1225: Persistence Provider Verification Command Surface

Date: 2026-09-29  
Status: Accepted

Root npm verification commands now expose and run persistence provider
configuration, selection preflight, selection behavior, and durable-write
activation preflight. The checks remain review-only and fail closed; no provider
selection, migration, durable write, or activation is enabled by this change.

Evidence: `package.json`,
`scripts/verify-persistence-provider-selection-preflight.mjs`,
`scripts/verify-persistence-provider-selection-preflight-behavior.mjs`, and
`scripts/verify-persistence-activation-preflight.mjs`.
