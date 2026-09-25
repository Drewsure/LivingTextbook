# DR-1221: Foundation Filesystem Verifier Coverage

Date: 2026-09-25  
Status: Accepted

The foundation composition now executes the durable database filesystem-path
verifier in addition to the durable storage and operations contract checks.
This ensures the broad gate tests actual root, traversal, extension, and
junction/symlink behavior rather than relying only on source fragments.

Evidence: `scripts/verify-foundation-composition.mjs`,
`scripts/verify-durable-progression-database-path.mjs`, ADR 1221.
