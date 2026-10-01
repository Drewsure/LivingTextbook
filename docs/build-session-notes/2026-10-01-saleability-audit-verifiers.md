# Build Session: Saleability Audit Canonical Verifiers

## Goal

Ensure the first-pilot status audit proves supplied evidence through the same
validators used by the actual intake and Z.ai review gates.

## Delivered

- Publisher roots now run the canonical intake preflight.
- Z.ai candidate roots now run the canonical Phaser evidence verifier.
- Failed supplied packages remain blocked instead of appearing proved.
- Default no-root behavior remains `waiting-human` and non-saleable.

## Verification

- `node --check scripts/audit-first-saleable-pilot.mjs`
- `npm run audit:pilot -- --json`
- `npm run verify:foundation-composition`
