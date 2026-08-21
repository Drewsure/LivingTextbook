# DR-479: Active Game Replay Route Links

Date: 2026-08-21

Status: Accepted

## Decision

Make active game replay checklist route paths clickable on `/teacher/intake`.

## Rationale

The replay checklist is intended to guide manual QA as well as future Codex, Z.ai, and Phaser integration review. Plain route text makes the checklist harder to use. Clickable links let a reviewer jump directly from the replay expectation to the active MiniStar or sample-publisher game route.

## Impact

- Replay checklist records now render route links for each active demo path.
- Active route verification checks that representative replay links stay visible.

## Constraints

- Links open existing reviewed routes only.
- No new route, storage write, assignment, upload, scoring, support-language, or prototype intake behavior changed.

## Verification

- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
