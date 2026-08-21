# 2026-08-21: Fill in the Blank Active Route

Added a text-spelling syntax student route at `/fill/[code]`.

Changes:
- Added `fill-in-the-blank` to the shared game mode type, catalog, scoring map, route contracts, route helper, and active route verification.
- Added playable MiniStar and sample publisher routes:
  - `http://127.0.0.1:3000/fill/demo-unit-1`
  - `http://127.0.0.1:3000/fill/partner-demo-unit-1`
- Added package audio cue coverage for dedicated instruction and feedback audio.
- Added activity hub, recommended route card, completion next path, teacher review labels, settings profiles, local companion plan, activity compatibility matrix, active route matrix, and unit game offer map coverage.
- Updated active route verification from 73 to 75 routes.

Boundaries:
- No Z.ai prototype or Phaser skin was imported.
- No support-language-only activity can unlock progress.
- No switch-template panel was introduced.
- No live storage, upload, or classroom workflow was enabled.

Verification:
- `npm run verify:game-modes`
- `npm run verify:package-readiness`
- `npm run verify:local-bundle`
- `npm run verify:activity-pathways`
- `npm run verify:game-settings`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`
