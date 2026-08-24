# DR-500: Prototype Return Package Checklist

Status: Accepted

Date: 2026-08-24

## Decision

Outside game work from Z.ai, Phaser prototypes, DOM reference prototypes, or any other external builder must return as a review evidence package before Codex considers wrapper review, patch planning, app integration, route creation, scoring changes, playlist changes, package promotion, or student assignment.

The teacher game-readiness workbench and tenant prototype review workbenches must show a returned prototype package checklist. The checklist must name source archive manifest requirements, reviewed fixture folder requirements, event and scoring replay, target-language audio coverage, mobile accessibility capture, wrapper boundary notes, required-before-Codex-review conditions, and blocked actions.

## White-Label Impact

Strongly positive. A publisher or school can work with external builders while the saleable platform keeps tenant data, branding, language policy, game wrappers, scoring, and route authority under LivingTextbook control.

## Cost Impact

Positive. The checklist avoids expensive premature importer, upload, scan, or storage work while giving external builders a precise return shape.

## Constraints

- Returned prototypes are evidence, not app imports.
- No archive import, direct file copy into `apps/web`, active route replacement, scoring mutation, reward inventory write, playlist creation, package promotion, or student assignment is allowed from this checklist.
- Target-language audio evidence is required before young learner routes can be considered.
- Support-language activity must remain support-only and cannot unlock progress.
- Phaser returns require wrapper evidence before any canvas-based work can be considered.

## Verification

- `npm run verify:prototype-review`
- `npm run verify:routes`
