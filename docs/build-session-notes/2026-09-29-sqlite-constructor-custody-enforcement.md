# Build Session: SQLite Constructor Custody Enforcement

## Goal

Make the durable SQLite store enforce its data custody boundary even when a
future server-side caller bypasses the normal deployment-gate helper.

## Implemented

- Validated the resolved database path before directory creation or SQLite
  opening.
- Bound direct construction to `LIVING_TEXTBOOK_PERSISTENCE_DATA_ROOT`.
- Added conformance coverage for an unsafe direct-constructor path.
- Preserved process-memory rehearsal behavior and all durable activation gates.

## Verification

`node scripts/verify-persistence-provider-conformance.mjs`

`npm run verify:persistence-runtime`

`npm run verify:foundation-composition`
