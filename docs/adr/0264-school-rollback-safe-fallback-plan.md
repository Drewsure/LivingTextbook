# ADR 0264: School Rollback Safe Fallback Plan

## Status

Accepted.

## Context

Rollback impact records explain what would be affected, but schools and teachers also need safe wording and fallback responsibilities before a printed QR route, local package, or media playlist can ever be paused.

## Decision

Add a read-only `School rollback safe fallback plan` to the school/admin review routes.

The plan covers student pause notices, teacher contact handoffs, school admin notices, publisher media notices, printed QR safe-pause rules, local companion fallback rules, and media playlist fallback rules.

It cannot send live notifications, mutate QR routes, shut down classrooms, replace media, export reports, deactivate local bundles, or reassign students.

## Consequences

- Future rollback design has child-safe wording before route behavior changes.
- Closed/local package support remains visible from the start.
- The platform keeps review copy separate from live notification or redirect systems.
