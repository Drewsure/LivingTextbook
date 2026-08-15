# Label It Playable Checks

Purpose: verify the first image-label pairing route before any live uploaded image or label editor is allowed.

Manual routes:
- `http://127.0.0.1:3000/label-it/demo-unit-1`
- `http://127.0.0.1:3000/label-it/partner-demo-unit-1`

Checks:
- The page shows `Core image-label slice`, `Label It`, `Pairing`, and `Label It Progress`.
- Instructions, label bank text, and feedback are tap-to-speak.
- Selecting a label and then the matching picture point emits standard answer and mastery events.
- Progress is based on target-language label placement only.
- The page states `No live upload`.
- Real uploaded images remain blocked until reviewed manifest, label anchor, rights, alt text, safety, audio, accessibility, and release gates exist.
