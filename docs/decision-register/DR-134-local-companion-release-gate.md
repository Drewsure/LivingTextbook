# DR-134: Local Companion Release Gate

## Decision

Add a visible local release gate to the local companion package preview.

## Reason

A closed local textbook companion is a saleable white-label product path, but only if it can be installed, updated, backed up, restored, reported from, and legally distributed with bundled media. The preview route must make those blockers visible before any handoff conversation.

## Standard

- `/local/sample-publisher` shows `Local release gate`.
- The gate distinguishes `pass`, `warning`, and `blocked` items.
- Each item names an owner, evidence, blocker, and next action.
- The gate blocks closed package handoff while installer/update, media rights/checksums, backup/restore/export, and school privacy/access policy are unresolved.
- Game/audio/reporting coverage may pass only for modes that preserve audio-first interaction and standard progress events.
