# DR-399: AI Gamification Mapping Validator

Date: 2026-08-11

Status: Accepted

## Decision

Add a shared validator for AI generated gamification mapping plans before generated packages can move toward reward readiness, package approval, route creation, playlist creation, assignment, or collection inventory writes.

## Rationale

The AI teaching game generator can propose scoring and collection unlock plans, but the platform needs deterministic reward math that is easy for teachers, schools, and parents to review. A shared validator prevents generated activity drafts from drifting into random reward pressure, generated gacha, media-only Star Dust, support-language mastery, unsupported trigger events, or unreviewed scoring totals.

## Impact

- The validator enforces the 1,000 Star Dust unit cap.
- The validator enforces the 750 Star Dust unit mastery threshold and 3,000 Star Dust module threshold.
- Scoring lanes must total exactly 1,000 Star Dust.
- Reward bindings must use deterministic unlock rules.
- Reward triggers are limited to `mastery_updated` or `game_completed`.
- Required gamification records and blocked reward actions must remain visible.
- The teacher generator route now shows gamification guard blocks and warnings.

## Constraints

- This does not publish rewards.
- This does not write collection inventory.
- This does not issue Spin Wheel tickets.
- This does not evolve avatars.
- This does not approve generated packages, routes, playlists, assignments, or student-ready markers.
- Support-language-only and media-only events cannot satisfy mastery or reward readiness.

## Verification

- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
