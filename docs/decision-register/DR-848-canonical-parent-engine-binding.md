# DR-848: Canonical Parent-Engine Binding

## Decision

Canonical mastery and completion events must identify the parent engine
declared for their game mode. The content model owns the mode-to-engine map,
and the replay verifier rejects missing or mismatched bindings.

## Rationale

This gives future Z.ai/Phaser wrappers a precise integration boundary and
prevents a visually similar prototype from silently crossing engine ownership.

## Boundaries

This is a completion-contract hardening change only. It does not authorize
source import, persistence, assignment, narrative routes, or paid AI Tutor
calls.

## Verification

`npm run verify:canonical-game-replays`

`npm run verify:runtime-behavior`

`npm run verify:foundation`
