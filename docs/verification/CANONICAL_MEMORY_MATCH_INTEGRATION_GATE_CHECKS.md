# Canonical Memory Match Integration Gate Checks

## Automated checks

- `npm run verify:memory-match-gate`
- `npm run verify:canonical-games`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`

## Review checks

- `/teacher/game-readiness` shows the canonical route and the frozen candidate
  as separate surfaces.
- The gate is blocked while any evidence lane is blocked or unreviewed.
- The frozen repository, snapshot, commit, and source-file count are visible.
- Nine evidence lanes are visible: profile, provenance, wrapper, fixture,
  events, audio, scoring, mobile/accessibility, and Codex decision.
- Blocked actions include source import, route replacement, scene-owned state,
  package promotion, and student assignment.
- No Z.ai source file is copied into `apps/web` by this gate.

## Acceptance boundary

Passing these checks prepares the evidence review. It does not approve Phaser
integration. A separate explicit Codex integration decision is required after
the missing evidence packet is returned and reviewed.
