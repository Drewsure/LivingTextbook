# DR-482: Generator Prototype Review Cross-Links

Date: 2026-08-21

Status: Accepted

## Decision

Add explicit links from `/teacher/generator/sample-publisher` and `/teacher/generator/ministar` to their focused prototype review workbenches.

## Rationale

The generator route still owns AI package request, prompt, cost, audio, gamification, and draft review context. The prototype route owns outside handoff and returned evidence review. The two surfaces should be easy to move between without implying live handoff, prototype import, route creation, scoring mutation, or patch approval.

## Impact

- The generator prototype-review section now links to `/teacher/prototypes/sample-publisher` or `/teacher/prototypes/ministar`.
- Active route verification checks that those links stay visible.

## Constraints

- Links are navigation only.
- No live model call, prototype handoff, Z.ai import, Phaser wrapper, app patch, scoring mutation, audio manifest mutation, package promotion, assignment, or storage write is enabled.

## Verification

- `node --check scripts\verify-active-routes.mjs`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run verify:routes`
