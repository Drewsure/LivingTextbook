# Build Session: Pilot Human Evidence Packet

## Goal

Give the real publisher and school a bounded way to supply delivery and release
decisions so the first-pilot audit can advance on evidence rather than manual
claims.

## Delivered

- Added the external two-file human evidence packet contract.
- Added a validator for policy, release, identity, QR, rehearsal, rollback, and
  checksum evidence.
- Added the audit `--human-evidence-root` option.
- Kept all writes, assembly, printing, persistence activation, and student use
  blocked.

## Verification

- `node --check scripts/verify-pilot-human-evidence.mjs`
- `npm run verify:pilot-human-evidence -- --self-test`
- `npm run audit:pilot -- --json`
- `npm run verify:publisher-pilot-intake-kit`
