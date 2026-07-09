# Sentence Builder Audio Action Checks

Run after Sentence Builder action controls change.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

## Browser Checks

Open:

- `http://127.0.0.1:3000/sentence/demo-unit-1`
- `http://127.0.0.1:3000/sentence/partner-demo-unit-1`

Confirm:

- The instruction is tap-to-hear.
- Target sentence is tap-to-hear and also has a visible Listen button.
- Word tiles speak when selected.
- Feedback is tap-to-hear.
- Reset has its own listen/replay control.
- Submit sentence has its own listen/replay control.
- The route still emits standard answer and mastery events through the local progression adapter.
