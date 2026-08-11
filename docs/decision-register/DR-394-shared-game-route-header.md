# DR-394: Shared Game Route Header

Date: 2026-08-11

Status: Accepted

## Decision

Use a shared `GameRouteHeaderCard` for active game-route wrappers instead of repeating one-off header card markup in each game family.

## Rationale

The active game routes now include Flashcards, Memory Match, Quiz, Sentence Builder, and Speak It. These routes should feel consistent while the platform remains structurally clean and white-labelable.

A shared header keeps the first screen pattern stable without changing the individual game engines, scoring, progress, microphone, assist-language, or event behavior.

## Impact

- Active game routes now share the same heading, summary, status, and earned-reward presentation component.
- The individual route wrappers still own their own game state and progression events.
- Future game routes can start with the shared route header instead of creating more duplicate layout code.

## Constraints

- This is structural cleanup, not premium polish.
- No game behavior, scoring, support-language gate, microphone policy, AI Tutor gate, route count, package data, or assignment behavior changes.
- The component must remain tenant-theme driven through existing CSS variables.

## Verification

- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
