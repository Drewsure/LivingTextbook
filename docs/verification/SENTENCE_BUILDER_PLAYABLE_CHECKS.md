# Sentence Builder Playable Checks

Run these checks when the playable Sentence Builder slice changes.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

## Browser Checks

Open:

- `http://127.0.0.1:3000/sentence/demo-unit-1`
- `http://127.0.0.1:3000/sentence/partner-demo-unit-1`

Confirm:

- Page loads.
- Two sentence rounds are available.
- Word tiles are visible.
- Target sentence and instructions are tap-to-speak.
- Submit is disabled until the correct number of tiles is selected.
- Incorrect order gives feedback and does not complete the round.
- Correct order advances/completes.
- Completion updates local progress and event log.

## Product Checks

- No AI generation is introduced.
- No random rewards are introduced.
- No production persistence claim is made.
- The mode remains structural and white-label.
