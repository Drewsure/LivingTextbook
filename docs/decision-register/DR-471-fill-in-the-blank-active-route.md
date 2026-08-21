# DR-471: Fill in the Blank Active Route

Date: 2026-08-21

Decision: Promote `fill-in-the-blank` to a first-class active student route at `/fill/[code]`.

Context: The platform needs more reusable game-mode breadth without importing outside game code before the integration gate is ready. Fill in the Blank is a low-cost text-spelling parent-engine mode that fits the curated pathway policy and gives teachers a simpler syntax activity before Sentence Builder.

Rationale:
- It reuses the text-spelling engine family and `syntax-construction-v1` scoring instead of creating a standalone game.
- It supports the white-label path for both MiniStar and the sample publisher package.
- It keeps target-language sentence audio as the progress trigger.
- It preserves support-language-only activity as support only.
- It extends the curated pathway model without adding a switch-to-anything template panel.

Consequences:
- Shared `GameModeId`, game catalog, scoring map, route contracts, route helper, activity hub, completion path, sample package audio coverage, local companion plan, unit game offer map, active route matrix, and verification scripts now include `fill-in-the-blank`.
- Active route verification grows to 75 checked routes.
- Any future premium/Phaser syntax skin must wrap this contract rather than replace its audio, scoring, and event rules.

Verification:
- `npm run verify:game-modes`
- `npm run verify:package-readiness`
- `npm run verify:local-bundle`
- `npm run verify:activity-pathways`
- `npm run verify:game-settings`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
- `npm run verify:routes`
