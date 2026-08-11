# DR-392: Active Game Route Contract Coverage

Date: 2026-08-11

Status: Accepted

## Decision

Require active core game routes to be represented in the route contract registry and guarded by `verify:game-modes`.

## Rationale

The product now has dedicated student routes for Memory Match, Quiz, Sentence Builder, and Speak It. A route can function in the browser but still drift from the architectural contract if the route registry and helpers are not checked.

The game-mode verifier should therefore confirm that every active core game route has:

- A route contract id.
- A route pattern.
- A route helper.

## Impact

The route contract now explicitly includes `/speak/[code]` alongside `/memory/[code]`, `/quiz/[code]`, and `/sentence/[code]`.

Future game-route additions must update the contract and helper layer before being treated as part of the foundation route set.

## Constraints

- This does not make all planned game modes active routes.
- Arcade skins such as Balloon Pop remain cataloged but not active route commitments.
- Flashcards remain the entry mode inside `/launch/[code]` until a dedicated flashcard route is intentionally created.
- AI Tutor and premium speech scoring remain optional, premium-gated, and off by default.

## Verification

- `npm.cmd run verify:game-modes`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
