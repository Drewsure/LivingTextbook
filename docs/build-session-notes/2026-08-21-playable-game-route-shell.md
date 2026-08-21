# 2026-08-21: Playable Game Route Shell

Refactored repeated text-spelling route wrappers into a shared `PlayableGameRouteShell`.

Changes:
- Added `PlayableGameRouteShell` for common header, teacher assignment settings, unit progress summary, completion-next card, and session event log layout.
- Moved Type Answer, Spelling Practice, Sentence Builder, and Fill in the Blank demo flows onto the shared shell.
- Restored Sentence Builder after the mid-refactor deletion and kept the dedicated `/sentence/[code]` route contract intact.

Boundaries:
- No game scoring changed.
- No support-language-only progress path was added.
- No live persistence, assignment mutation, settings save, report export, or upload workflow was enabled.
- No Z.ai prototype or Phaser game code was imported.

Verification:
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
