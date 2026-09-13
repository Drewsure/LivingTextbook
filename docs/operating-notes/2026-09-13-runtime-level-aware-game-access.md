# Operating Note OW-054: Runtime Level-Aware Game Access

## Context

The Level 1 sample intentionally does not offer Sentence Builder. A student
can still arrive at a later-level route by direct URL or by a stale QR code,
so offer-map and recommendation validation alone are not sufficient.

## Procedure

When adding or changing a playable game route:

1. Read the unit level from the canonical unit payload.
2. Check the game mode with `isGameModeSupportedAtLevel`.
3. Render the level-specific gate when the mode is unsupported; do not mount
   the interactive child.
4. Apply the same check before local progression start and completion.
5. Preserve progression state and award zero Star Dust for rejected attempts.
6. Return the learner to the reviewed activity hub, not to an unreviewed game.
7. Filter reviewed offer-map recommendations by the same level contract before
   showing them in the activity hub.
8. Apply the same filter to post-completion next-activity suggestions.
9. Run the canonical-game, runtime, typecheck, production-build, and route
   verification commands.

## Resolution

The playable route and local progression adapter now enforce the same boundary.
Unsupported direct routes remain visible enough to explain the curriculum
pathway, but cannot generate gameplay or progression evidence. This does not
request Z.ai integration; external Phaser candidates remain isolated until a
later mapping and approval stage.
