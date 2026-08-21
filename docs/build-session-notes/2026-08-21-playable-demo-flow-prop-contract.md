# 2026-08-21: Playable Demo Flow Prop Contract

Extracted the shared active-game demo-flow prop shape into `PlayableGameDemoFlowProps`.

Changes:
- Added the shared prop type to `PlayableGameRouteShell`.
- Updated active non-entry demo flows to use the shared type.
- Left Flashcards on its specialized entry prop contract.

Boundaries:
- No game behavior changed.
- No scoring, audio, support-language, microphone, upload, assignment, or persistence policy changed.
- No Z.ai or outside prototype work was imported.

Verification:
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
