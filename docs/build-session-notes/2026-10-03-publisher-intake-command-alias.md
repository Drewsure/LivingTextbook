# Build Session: Publisher Intake Command Alias

## Outcome

Restored the documented `create:publisher-pilot-intake-kit` npm command. The
generator already existed at `scripts/create-publisher-pilot-intake-kit.mjs`,
but the package script was missing, so the documented human-side command failed
before the intake kit could be created.

## Verification

- `npm run create:publisher-pilot-intake-kit -- --help`
- `npm run verify:publisher-pilot-intake-kit`

Both pass. The command creates external review-only intake folders and does not
upload, assemble, print QR codes, activate persistence, or enable students.

## Boundary

This fixes command discoverability only. A real publisher source package,
rights evidence, delivery policy, and release authorization remain human-owned
inputs for the saleability audit.
