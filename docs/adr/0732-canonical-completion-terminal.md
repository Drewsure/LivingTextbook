# ADR 0732: Canonical Completion Terminal Boundary

## Status

Accepted

## Context

Canonical game replay validation already requires one completion event and
places answer activity before mastery and completion. It did not explicitly
reject a later gameplay event, so a malformed replay could show another round
or answer after the game was complete.

## Decision

Treat `game_completed` as the terminal gameplay boundary. Reject any later
`game_started`, `round_shown`, `answer_submitted`, `answer_result`, or
`mastery_updated` event. Permit non-gameplay learning-audio replay only when it
does not reopen gameplay or grant progression.

## Consequences

Late gameplay mutations fail closed across canonical DOM games and future
approved Phaser wrappers. Completion and progression remain idempotent, while
students can still replay learning audio as an accessible support action.

## Verification

Run `npm run verify:runtime-behavior` and
`npm run verify:canonical-games`.
