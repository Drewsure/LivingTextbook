# 2026-08-11 Assignment Launch Activity Hub Navigation

## Summary

Connected existing student entry surfaces to the curated activity hub.

## Changes

- Added `activityHubPath` to sample private assignment link contexts.
- Added a secondary `Open activity hub` action to private assignment previews.
- Added reviewed activity hub guidance to the student launch recommended-game card.
- Strengthened route verification for MiniStar and sample publisher launch/assignment pages.

## Boundaries

- No activity conversion.
- No template switching.
- No student progress unlock from navigation.
- No student assignment state mutation.
- No live persistence.

## Verification Target

Run typecheck, production build, active routes, and full foundation verification after the route navigation update.
