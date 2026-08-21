# 2026-08-21: Active Playable Route Shell Consolidation

Expanded `PlayableGameRouteShell` from text-spelling routes to the remaining active non-entry playable routes.

Changes:
- Moved Memory Match, Match Up, Label It, Quiz, True or False, Balloon Pop, and Speak It onto the shared playable route shell.
- Added optional status tone support to the shell so Speak It can preserve its microphone-approved and microphone-off display.
- Left Flashcards as a specialized entry route because it owns target-practice readiness, assist-language display, entry completion, reward preview, and recommended route guidance.

Boundaries:
- No game behavior changed.
- No scoring, reward, target-language, support-language, upload, microphone, or persistence policy changed.
- No Z.ai prototype or Phaser code was imported.

Verification:
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
