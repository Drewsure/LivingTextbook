# DR-086: Progress Event Taxonomy Panel

## Decision

Add a teacher/admin progress event taxonomy panel to `/teacher/intake`.

## Reason

The platform now has target-language progress events, support-language reporting, route guidance listening, multimedia events, and game events. Before choosing backend storage, the team needs a visible source of truth for which events affect progression and which remain report-only or support-only.

## Standard

- Event effect must be explicit.
- Support-only events must not award mastery or unlocks.
- Teacher-visible does not mean production persistence is complete.
- Future game modes must map into the taxonomy before pilot release.

