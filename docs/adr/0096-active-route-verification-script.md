# ADR 0096: Active Route Verification Script

## Status

Accepted

## Context

The project now has a growing set of active scaffold routes across MiniStar, the sample publisher, teacher reports, Training Academy, and stable QR aliases. Repeated manual route checks are useful but easy to miss.

## Decision

Add a lightweight Node route verification script that reads `docs/ACTIVE_ROUTE_VERIFICATION_LIST.md` and checks every active local URL before the planned/not-active QR section.

## Consequences

Route checks become cheaper and more consistent. The script does not replace browser inspection, accessibility checks, or publish gates; it only catches dead/500 routes quickly.
