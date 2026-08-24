# ADR 0431: Prototype Return Storage Guard Visibility

## Status

Accepted.

## Context

The platform now has a backend-neutral storage contract for returned prototype package checklists. Without a visible guard on the game-readiness and prototype review workbenches, a future agent could treat returned Z.ai, Phaser, DOM reference, or outside-game work as ready to import simply because the checklist exists.

## Decision

Expand the existing prototype storage guard panel so it covers both intake queue storage and returned package checklist storage. The panel must show hosted/local write intents, schema/migration ids, visible record fields, required evidence, and blocked actions before outside work can move toward Codex review.

## Consequences

- Teachers and reviewers can see that returned prototype evidence is captured but not integration-ready.
- Codex retains final architecture, wrapper, route, scoring, reward, playlist, package, and assignment control.
- Outside AI work remains useful without becoming a shortcut around parent engines or white-label storage boundaries.
- Route and prototype-review verifiers must protect the visible guard markers.
