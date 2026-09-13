# ADR 0701: Runtime Level-Aware Game Access

## Status

Accepted

## Context

Offer maps, assignments, and recommendation policy already use the canonical
game-mode supported-level matrix. A direct or stale game URL could still reach
the playable route, and local progression methods could be called without the
student first passing through the activity hub.

## Decision

Apply the shared curriculum-level contract in both places:

- The playable route shell must render an explanatory level gate instead of an
  interactive game when the mode is unsupported for the unit level.
- The local progression adapter must reject unsupported start and completion
  requests, awarding no Star Dust and preserving progression state.

The gate returns the student to the reviewed activity hub. It does not replace
the canonical level matrix or remove reusable later-level routes.

## Consequences

- Direct URLs cannot bypass the curated curriculum pathway.
- Unsupported activity attempts cannot create completion or reward evidence.
- The route remains understandable to young learners and teachers.
- Later-level game integrations can be promoted without changing the shared
  route shell.
- This remains a local review boundary until persistence and production
  providers are approved.

## Verification

- `npm run verify:canonical-games`
- `npm run verify:runtime-behavior`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes`
