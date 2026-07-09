# Sentence Builder Discovery Checks

Run these checks when Sentence Builder route discovery changes.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

## Browser Checks

Open:

- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/teacher/intake`
- `http://127.0.0.1:3000/sentence/demo-unit-1`
- `http://127.0.0.1:3000/sentence/partner-demo-unit-1`

Confirm:

- Dashboard game sequence lists Sentence Builder.
- Teacher intake game offer map lists Sentence Builder.
- Sentence Builder routes still load.
- The route is described as an active scaffold, not a polished final game.
