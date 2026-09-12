# ADR 0672: Canonical Game Entry Access Gate

## Decision

The shared playable game route shell must derive access from the supplied
`StudentProgressionState`. It must never add the current game mode to
`unlockedGameModes` merely because a learner opened its URL.

Direct game URLs remain viewable for teacher review and route verification, but
an unopened game renders a visible entry-practice gate and does not mount the
interactive game component. This keeps the teacher QR -> entry practice ->
curated activity path authoritative while the future persistence adapter is
still review-only.

## Consequences

- Flashcard entry practice remains the only initial learner gate.
- A direct URL cannot emit `game_started`, answer, mastery, or completion
  evidence for a locked mode.
- The route can still show its shell, audio contract, and a link back to entry
  practice for inspection and accessibility review.
- Future hosted, local, and hybrid progression adapters must provide the
  unlocked state explicitly; the UI cannot manufacture it.
- Phaser or other wrappers inherit this boundary because they mount only after
  the shell confirms access.

## Verification

`verify-canonical-game-integrations.mjs` checks that the shell derives
`gameUnlocked`, renders `GameAccessGateCard` when false, and contains no
self-unlock shortcut.
