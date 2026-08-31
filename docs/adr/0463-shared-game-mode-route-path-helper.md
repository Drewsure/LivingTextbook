# ADR 0463: Shared Game-Mode Route Path Helper

Status: Accepted

Date: 2026-08-31

## Context

Launch, activity hub, recommendation, completion, teacher shortcut, and partner demo surfaces all need to turn a reviewed game mode into a local route. Several components carried their own mode-to-route switch logic, which created drift risk as more game modes were added.

## Decision

Game-mode route paths should be resolved through a shared exhaustive helper, `getGameModeRoutePath`, before student, teacher, or partner demo surfaces link to playable game routes.

## Consequences

- New game route additions have one primary route mapping to update.
- Typecheck should fail when a new `GameModeId` is added without a corresponding playable route mapping.
- Student activity hubs, recommended paths, completion cards, teacher shortcuts, and partner demo shortcuts now share the same game-mode route behavior.
- Unit offer maps may still provide explicit reviewed launch routes when a tenant needs package-specific routing.
- Printable, media, training, collection, teacher, and assignment routes remain explicit because they are not game-mode routes.

## Still Blocked

- No route publishing.
- No unrestricted template switching.
- No direct promotion of Z.ai or outside prototypes into active routes.
- No support-language-only progress.
