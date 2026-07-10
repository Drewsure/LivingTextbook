# DR-085: Route Guidance Listen Events

## Decision

Record recommended-route listen taps as `route_guidance_listened` events.

## Reason

Students should be able to hear what each next activity means, and teachers should be able to see that guidance audio was used. The event must remain support-only and must not unlock progress, award mastery, or replace target-language practice.

## Standard

- Route listening is reportable support.
- Route listening is not a progression trigger.
- Event metadata must include `progressionUnlockAllowed: false`.
- Support-language unlock metadata must remain false.

