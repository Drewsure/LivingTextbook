# DR-400: AI Reward Readiness Uses Gamification Guard

Date: 2026-08-11

Status: Accepted

## Decision

AI reward readiness gates must depend on shared gamification mapping guard clearance before any generated reward, collection, route, playlist, assignment, package approval, or student-ready workflow can exist.

## Rationale

The gamification validator checks the reward math, but reward readiness is the later teacher-facing gate where a reviewer might expect a go/no-go signal. If reward readiness does not explicitly depend on the validator, generated packages could appear reward-ready while the underlying Star Dust, trigger, or blocked-action map is unsafe.

## Impact

- Reward readiness checks now include `Gamification mapping guard clear`.
- The check calls `validateAiGamificationMappingPlan`.
- Generator verification requires this dependency.
- Active route verification asserts the dependency appears in the teacher generator UI.

## Constraints

- This does not publish rewards.
- This does not write collection inventory.
- This does not issue Spin Wheel tickets.
- This does not evolve avatars.
- This does not approve generated packages, routes, playlists, assignments, or student-ready markers.
- Correction queue, target-language audio, media rights, teacher approval, and release-control gates remain required.

## Verification

- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
