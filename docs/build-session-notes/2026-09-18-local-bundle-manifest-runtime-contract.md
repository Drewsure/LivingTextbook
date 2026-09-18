# Build Session: Local Bundle Manifest Runtime Contract

## Outcome

Added a shared content-model validator and executable runtime check for
local/offline bundle manifests. Planning samples remain reviewable with visible
warnings; unsafe paths, duplicate identities, incomplete checksums, and
unsupported offline-ready claims are rejected.

## Safety Boundary

The validator is pure. It does not upload or copy files, generate checksums,
register a service worker, cache media, store learner data, or mark the current
bundle offline-ready.

## Verification

- `node scripts/verify-local-bundle-manifest-runtime.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run typecheck --workspace @living-textbook/ai-service`
- `npm run verify:local-bundle`
- `npm run verify:foundation`

Recorded as ADR 0851 and DR-923.
