# Build Session: Closed-Local Release Lineage

## Outcome

The local-package route now checks the same live release lineage as the
controlled delivery writer before it invokes the package assembler.

## Safety boundary

Missing or mismatched source review, package evidence, checksum, packet, or
delivery mode blocks without copying files or generating QR artifacts. The
existing explicit local write gate remains in force.

## Verification

- `node scripts/verify-local-pilot-package-assembler.mjs`
- `node scripts/verify-foundation-composition.mjs`
- Web typecheck and production build
