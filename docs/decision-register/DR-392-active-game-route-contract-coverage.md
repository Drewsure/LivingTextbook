# DR-392: Active Game Route Contract Coverage

Date: 2026-08-11

Status: Accepted

## Decision

Require active core game routes to be represented in the route contract registry and guarded by `verify:game-modes`.

## Rationale

The product now has dedicated student routes for Flashcards, Match Up, Label It, Memory Match, Balloon Pop, Quiz, True or False, Type Answer, Sentence Builder, and Speak It. A route can function in the browser but still drift from the architectural contract if the route registry and helpers are not checked.

The game-mode verifier should therefore confirm that every active core game route has:

- A route contract id.
- A route pattern.
- A route helper.

## Impact

The route contract now explicitly includes `/flashcards/[code]`, `/match/[code]`, `/memory/[code]`, `/balloon/[code]`, `/quiz/[code]`, `/sentence/[code]`, and `/speak/[code]`.

Future game-route additions must update the contract and helper layer before being treated as part of the foundation route set.

## Constraints

- This does not make all planned game modes active routes.
- Arcade skins can become active only through a parent-engine route contract. Balloon Pop is now active as a structural selection-engine skin, not as a Phaser-polished arcade product.
- Flashcards remain the entry mode for classroom launch, but `/flashcards/[code]` is also an active direct activity route.
- Match Up is active as a visible pairing-engine route before hidden-card Memory Match recall.
- AI Tutor and premium speech scoring remain optional, premium-gated, and off by default.

## Verification

- `npm.cmd run verify:game-modes`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
