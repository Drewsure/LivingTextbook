# Build Session: First-Pilot Saleability Audit

## Goal

Make first-pilot status operationally unambiguous without claiming saleability
before real evidence and approvals exist.

## Delivered

- Added `scripts/audit-first-saleable-pilot.mjs`.
- Added `npm run audit:pilot`.
- Separate proved platform evidence from human-owned gates.
- Support explicit publisher and Z.ai candidate folders.
- Preserve read-only, fail-closed behavior and exact next actions.

## Verification

- `npm run audit:pilot`
- `npm run audit:pilot -- --json`
- `npm run verify:local-package-operator-behavior`
- `npm run typecheck --workspace @living-textbook/web`
