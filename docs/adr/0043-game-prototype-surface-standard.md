# ADR 0043: Game Prototype Surface Standard

Date: 2026-07-09

## Status

Accepted

## Context

Z.ai has worked on Phaser-based games in `Drewsure/ministar-lab`. Phaser is useful for action-heavy learning modes, but the platform also needs text-heavy engines where accessible text, tap-to-speak behavior, localization, deterministic scoring, and teacher reporting matter more than canvas rendering.

A previous Sentence Builder prompt could be misread as preferring static games generally. That is not the intended architecture.

## Decision

Add a prototype assignment standard and admin panel that classify modes by recommended prototype surface:

- Phaser for action, timing, collision, physics, and reflex modes.
- DOM/React-style reference prototypes for text, syntax, spelling, quiz, and reporting-heavy modes.

## Consequences

Positive:

- Preserves Phaser where it is strongest.
- Keeps Sentence Builder and similar engines easy to integrate and verify first.
- Gives Z.ai clearer instructions.
- Avoids 48 isolated canvas games with inconsistent events.

Tradeoffs:

- Some text-heavy modes may look plainer in early prototypes.
- Some Phaser prototypes may require an extra wrapper before LivingTextbook integration.

## Verification

Use `docs/verification/GAME_PROTOTYPE_ASSIGNMENT_CHECKS.md` after pulling connector-side commits.
