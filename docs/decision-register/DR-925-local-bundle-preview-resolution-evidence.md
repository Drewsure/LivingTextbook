# DR-925: Local Bundle Preview Resolution Evidence

## Decision

Make each local companion preview exercise the shared validated,
tenant-scoped, read-only resolver and display its route and asset evidence.

## Included

- MiniStar and sample-publisher tenant scope.
- Manifest-declared QR fallback resolution.
- Manifest-declared local asset resolution.
- Visible warnings and explicit side-effect boundaries.

## Excluded

File or directory reads, uploads, bundle writes, service workers, media
precache, offline activation, learner-data persistence, rights approval, and
local handoff.

## Verification

`node scripts/verify-local-bundle-readiness.mjs` checks the preview markers and
invokes the manifest and resolver runtime checks. `npm run verify:foundation`
remains the full gate.
