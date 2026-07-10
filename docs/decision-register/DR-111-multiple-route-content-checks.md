# DR-111: Multiple Route Content Checks

## Decision

The active route verifier should support multiple expected text checks per route.

## Reason

Some routes need more than one foundation signal. Media playlist routes should prove both the metadata route and the demo media controls are present.

## Standard

- Expected route text can be a list.
- Media playlist routes must include `Media playlist route` and `Demo media controls`.
- Missing expected text fails route verification.
