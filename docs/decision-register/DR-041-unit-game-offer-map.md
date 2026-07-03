# DR-041: Unit Game Offer Map

Status: Accepted

Date: 2026-07-03

## Decision

Represent per-unit game availability as a reviewed unit game offer map before building more game routes or publisher-specific game pages.

## Reason

White-label tenants and textbook publishers need to choose, maintain, and sell different game offerings by unit and edition. The platform must support required, optional, premium, teacher-only, hidden, and blocked game states without creating one-off pages or breaking teacher reporting.

## White-Label Impact

Strongly positive. A publisher can maintain its own game offer map while the platform preserves shared engines, audio support, route stability, progress events, and tenant package rules.

## Cost Impact

Positive. A data-driven map reduces custom implementation work for each partner and prevents premature construction of 48 isolated games.

## Constraints

- Every student-facing game offer maps to a reusable parent engine.
- Every student-facing game offer has learner-facing audio requirements.
- Background music/video is optional and separate from comprehension audio.
- Premium game availability must be tenant/package configuration, not child-facing pressure.
- Teacher-only microphone activities require teacher approval and no automatic microphone start.
- Hidden and blocked offers cannot appear in normal student progression.
- Student-facing offers must report standard progress events.

## Follow-Up

Promote the app-local sample shape into `packages/content-model` after the admin contract is reviewed and before production persistence is selected.
