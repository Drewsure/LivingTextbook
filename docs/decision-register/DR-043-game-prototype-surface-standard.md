# DR-043: Game Prototype Surface Standard

Status: Accepted

Date: 2026-07-09

## Decision

Assign prototype surface by game mechanic rather than using Phaser for everything or static DOM for everything.

## Rule

Use Phaser for action, movement, physics, timing, collision, and reflex games.

Use DOM/React-style reference prototypes for text-heavy, syntax-heavy, spelling-heavy, quiz/reporting-heavy games.

## Reason

Phaser can produce better-feeling arcade games, but it is not automatically better for syntax construction or report-heavy text interaction. Sentence Builder needs accessible text tiles, tap-to-speak behavior, deterministic scoring, and clean event output before premium animation.

## White-Label Impact

Positive. Different tenants can receive premium game skins later while the core platform preserves accessible logic, audio support, and event contracts.

## Cost Impact

Positive. Phaser work is aimed where it has clear value, while text engines remain cheaper and easier to integrate first.

## Constraints

- Z.ai Phaser prototypes stay isolated in `Drewsure/ministar-lab`.
- Phaser prototypes must emit LivingTextbook events before integration.
- Phaser prototypes must keep comprehension audio separate from background music.
- DOM/reference prototypes must not be mistaken for final premium polish.
- No prototype becomes production without Codex review of schema, audio, scoring, events, accessibility, and white-label fit.

## Follow-Up

Use the prototype assignment board on `/teacher/intake` when deciding the next Z.ai prompt.
