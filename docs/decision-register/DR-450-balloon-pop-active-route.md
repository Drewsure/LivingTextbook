# DR-450: Balloon Pop Active Structural Route

Date: 2026-08-15

Status: Accepted

## Decision

Promote Balloon Pop from catalog-only planning to an active structural student route at `/balloon/[code]`.

## Rationale

Early learner engagement needs a playful vocabulary reinforcement mode, but the foundation must stay reusable-engine first. Balloon Pop now reuses the selection parent engine, standard progress events, deterministic arcade scoring, and package-level audio coverage instead of introducing a one-off Phaser game or premium-polished arcade surface too early.

## White-Label Impact

Positive. The route works for both MiniStar and the sample publisher tenant from the same payload, route resolver, audio package, assignment metadata, and active route verification path.

## Cost Impact

Positive. A structural DOM route is cheaper to build, test, and maintain than a custom Phaser implementation. Phaser or Z.ai motion work can still be layered later through the wrapper standards once the event/audio/scoring contract remains stable.

## Constraints

- Balloon Pop remains a structural scaffold, not a finished AAA arcade skin.
- Every prompt, instruction, and feedback item must remain audio-supported.
- Support-language activity cannot unlock progress.
- Scoring must use `arcade-reinforcement-v1` and remain deterministic.
- No random rewards, child-facing premium upsell, route publishing shortcut, or package writer shortcut is introduced.
- Future Phaser polish must keep the parent-engine wrapper, event envelope, audio coverage, and mobile accessibility requirements.

## Verification

- `npm.cmd run verify:game-modes`
- `npm.cmd run verify:package-readiness`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
