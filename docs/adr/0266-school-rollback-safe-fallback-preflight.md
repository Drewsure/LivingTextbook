# ADR 0266: School Rollback Safe Fallback Preflight

## Status

Accepted.

## Context

Safe fallback copy is not enough by itself. Before a printed QR pause, local companion fallback, media playlist pause, teacher handoff, or school support page can ever be activated, the platform needs a review checklist that keeps child-safe wording, support-language boundaries, local backup/update, media rights, and assignment/report policy visible.

## Decision

Add a read-only `School rollback safe fallback preflight` beside the safe fallback plan on school/admin review routes.

The preflight covers:

- child-safe copy review,
- school communication policy,
- printed QR fallback policy,
- local companion fallback policy,
- media playlist fallback policy,
- assignment and report policy.

It cannot activate fallback copy, mutate QR routes, notify live users, shut down classrooms, deactivate local bundles, replace media, reassign students, or export reports.

## Consequences

- Future fallback activation work has a visible checklist before implementation.
- Child-safe copy and support-language limits remain explicit.
- Closed/local package responsibilities stay part of the foundation rather than an add-on.
