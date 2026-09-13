# ADR 0712: Phaser Candidate Gate Behavior

## Status

Accepted for foundation verification.

## Decision

The foundation suite must execute a temporary synthetic Memory Match evidence
package through the actual candidate verifier. The complete package must pass,
and a controlled mutation that sets `randomRewards` to true must be rejected.

## Rationale

Static marker checks prove that validation code exists, but they cannot prove
that the return envelope, artifact paths, checksums, and evidence-content rules
work together. A source-free behavior fixture provides that proof without
waiting for or importing an external Z.ai package.

## Boundary

The test creates and removes only a temporary fixture. It contains no frozen
candidate source, no learner identity, no production route, and no persistence
write. It does not change the wrapper approval state of any candidate.

## Verification

`npm run verify:phaser-candidate-package-behavior` proves the passing and
rejection paths. The command is included in `npm run verify:foundation`.
