# AI Authoring Verifier Checks

Run these checks when the AI authoring verifier scaffold changes.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

## Browser Checks

Open:

- `http://127.0.0.1:3000/teacher/intake`

Confirm:

- The AI authoring verifier panel appears after source review and before package release.
- The panel says teacher control is required.
- The release rule blocks AI drafts, PDF extraction, translations, visual prompts, and media matches from direct student assignment.
- Schema, audio, assist-language, media-rights, and teacher approval stages are visible.
- Media rights are blocked.
- Assist language rejects progression triggers and unreviewed live translation.

## Product Checks

- No live AI model call is introduced.
- No production verifier claim is made.
- No AI draft is treated as source of truth.
- Teacher/package approval remains required.
- The scaffold preserves white-label tenant boundaries.
