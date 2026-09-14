# ADR 0768: Text/Spelling Engine Runtime Contract

## Status

Accepted

## Context

Sentence Builder is the first canonical Text/Spelling slice and supplies the
shared structure for ordering, fill-in, spelling, typing, and related modes.
Static checks did not prove that the adapter preserved the reviewed two
sentences, tile order, punctuation behavior, audio, and scoring identity.

## Decision

Require runtime evidence that the Text/Spelling engine consumes exactly two
target sentences, produces deterministic ordered tiles with learner-language
audio, strips only terminal punctuation from the tile sequence, and declares
the shared event and scoring contracts.

## Consequences

Text/Spelling skins inherit one auditable sentence and audio boundary. A
visual or Phaser skin cannot replace the reviewed sentence structures with
uncontrolled generated grammar. This does not authorize source promotion,
persistence, or student assignment.

## Verification

Run `npm run verify:text-spelling-engine-runtime` and the complete
`npm run verify:foundation` suite.
