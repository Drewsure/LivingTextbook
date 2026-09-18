# DR-931: Local Bundle Snapshot Asset Gate

## Decision

Make the local companion snapshot fail closed when any declared asset lacks
rights, checksum, scan, target mapping, or accessibility evidence.

## Verification

`node scripts/verify-local-bundle-readiness.mjs` guards the snapshot markers,
while `npm run verify:foundation` exercises the full route and build gate.

## Excluded

No package writing, file access, media copying, caching, offline activation,
or student-facing promotion is added.

See ADR 0859 and
`docs/adr/0859-local-bundle-snapshot-asset-gate.md`.
