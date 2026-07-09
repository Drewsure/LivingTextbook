# ADR 0079: Active Route Verification List

## Status

Accepted

## Context

The build now exposes multiple student, teacher, partner, game, training, and QR alias routes. The route surface was larger than the existing route-specific verification notes.

## Decision

Add `docs/ACTIVE_ROUTE_VERIFICATION_LIST.md` and matching verification checks.

## Consequences

Future route-related work has a single QA map. Route availability remains a foundation check and does not imply pilot-publishable release status.
