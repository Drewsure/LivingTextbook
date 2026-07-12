# ADR 0162: Foundation Gate Session Settings Visibility

## Status

Accepted

## Context

`npm run verify:session-settings` is now part of the foundation check. The teacher intake panel and local verification runbooks should show this so the human review path matches the automated command.

## Decision

Expose teacher-session settings safety in the foundation verification gate and refresh the local verification documentation.

## Consequences

- `/teacher/intake` names `npm run verify:session-settings`.
- Active route verification checks that the teacher-facing foundation gate shows the new command.
- Local runbooks describe the expanded foundation command accurately.
- Teacher-session safety remains visible before backend, persistence, or live classroom decisions.
