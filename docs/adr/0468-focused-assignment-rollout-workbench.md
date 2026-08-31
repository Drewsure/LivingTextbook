# ADR 0468: Focused Assignment Rollout Workbench

Status: Accepted

Date: 2026-08-31

## Context

Student assignments are a core classroom and white-label product promise. The foundation already has private assignment routes, teacher assignment readiness data, rollout gates, class roster readiness, report boundaries, and launch-safety blockers, but much of that evidence lived inside the broad teacher intake page.

The platform needs a focused review route before live assignment scheduling, private-link activation, roster binding, progress streams, teacher report export, or school pilot launch can exist.

## Decision

Add `/teacher/assignments` as the focused assignment rollout workbench.

The page gathers teacher assignment readiness, assignment rollout gates, and roster readiness in one teacher/admin surface. It links to the two current private assignment previews, the two teacher session monitor previews, reporting readiness, and persistence readiness.

## Guardrails

- The route is review-only.
- It cannot schedule classes, activate private assignment links, bind rosters, start progress streams, collect real learner data, export reports, or bypass school policy.
- Private assignment links and QR/front-door entry remain the first safe sharing path.
- Public sharing, iframe embeds, live roster binding, report export, and generated-package assignment handoff stay blocked until persistence, launch safety, school policy, target-language audio, and rollout evidence pass.
- Active route verification must include the focused workbench.

## Verification

- `npm.cmd run verify:assignment-rollout`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
