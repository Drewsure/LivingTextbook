# Build Session: Publisher Handoff Asset Custody Binding

## Goal

Make the publisher-facing local-package handoff prove where approved assets
came from before the pilot can be treated as saleable.

## Delivered

- Added approved asset source scope and copied-asset count to the shared local
  package handoff contract.
- Bound those fields to the immutable assembly record in the runtime reader.
- Added visible runtime facts for asset custody and approved asset count.
- Extended assembler behavior verification to assert package-scoped promotion
  is preserved in the handoff.
- Recorded ADR 1348 and DR-1347.

## Boundaries

No raw payload export, installer generation, learner records, hosted activation,
QR mutation, or student-facing activation was added.
