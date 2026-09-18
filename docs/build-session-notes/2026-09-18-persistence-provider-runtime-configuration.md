# Build Session: Persistence Provider Runtime Configuration

## Outcome

Added an executable runtime check for the provider-neutral persistence adapter.
The check proves the safe unset rehearsal default, supported provider values,
whitespace trimming, and fail-closed handling for unsupported configuration.

## Safety Boundary

The check transpiles only the adapter into an isolated temporary directory and
stubs the durable-store dependency. It does not instantiate SQLite, create a
database, select a hosted vendor, write learner data, or enable live persistence.

## Verification

- `node scripts/verify-persistence-provider-configuration.mjs`
- `node scripts/verify-persistence-adapter-seam.mjs`
- `npm run verify:persistence-runtime`
- `npm run verify:foundation`

Recorded as ADR 0850 and DR-922.
