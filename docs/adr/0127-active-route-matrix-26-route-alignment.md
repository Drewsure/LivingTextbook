# ADR 0127: Active Route Matrix 26-Route Alignment

## Status

Accepted

## Context

Active route verification now checks 26 routes after adding teacher report package preview routes. The visible active route matrix still listed a compact subset.

## Decision

Update the active route matrix data so `/teacher/intake` displays the same 26 checked routes.

## Consequences

- Reviewers can see the actual local route surface without reading the verification script.
- New route work has a clearer maintenance target.
- The intake page becomes a better non-technical QA map.
