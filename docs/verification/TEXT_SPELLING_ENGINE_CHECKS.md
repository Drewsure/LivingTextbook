# Text-Spelling Engine Checks

Run these checks when text-spelling engine scaffold changes.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

## Browser Checks

Open:

- `http://127.0.0.1:3000/`

Confirm:

- Sentence Builder Preview appears below the game sequence and selection engine preview.
- It shows two target sentence rounds.
- Each round shows word tiles.
- Standard events are visible.
- Integration notes explain that Phaser/premium skins must wrap the same contract.

## Product Checks

- No live playable claim is made.
- No AI generation occurs in the game engine.
- Audio-first requirements remain visible.
- The preview does not replace the existing playable Memory Match path.
