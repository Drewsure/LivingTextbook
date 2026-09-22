# QR Alias Backend Alignment Checks

These checks keep the future durable route-alias store aligned with the shared
QR runtime contract.

## Required checks

- `npm run verify:qr-alias-backend-alignment`
- `npm run verify:qr-alias-rollback-boundary`
- `npm run verify:foundation-composition`
- `npm run verify:foundation`

The schema draft, migration candidate, and migration spec must preserve
printed QR identity, current and previous release identity, safe target and
fallback paths, rollback evidence, tenant scope, and mutation-block fields.

## Explicit non-goals

Alignment does not select a database, run a migration, write a route, mutate a
QR redirect, swap a package or media asset, activate a local bundle, or execute
rollback.
