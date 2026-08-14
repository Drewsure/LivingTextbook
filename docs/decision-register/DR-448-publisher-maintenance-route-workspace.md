# DR-448: Publisher Maintenance Route Workspace

## Status

Accepted.

## Context

The full `/teacher/intake` route now contains many foundation gates. Publisher maintenance is important enough for partner conversations that it needs a focused route instead of being discoverable only inside the long intake page.

## Decision

Add `/teacher/maintenance/sample-publisher` as a focused teacher/admin route for yearly publisher maintenance review.

The route shows the shared publisher maintenance panel plus a route-specific blocked-action summary for route mutation, media replacement, game availability publishing, report policy changes, local bundle release, and partner self-maintenance actions.

## Consequences

- Partner maintenance can be shown directly during white-label discussions.
- The route remains review-only and cannot mutate packages, routes, media, games, reports, local bundles, or release state.
- Active route verification grows to 60 checked routes.
