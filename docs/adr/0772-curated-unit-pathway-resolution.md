# ADR 0772: Curated Unit Pathway Resolution

## Status

Accepted

## Context

The platform deliberately avoids a large teacher-facing switch-anything panel.
Each tenant and unit needs a reviewed activity pathway that can change by
curriculum, level, package, and readiness without changing game components.
The dashboard sequence had been assembled from a static component list, which
could drift from the curated offer map.

## Decision

Resolve the visible Game Sequence from the tenant's curated unit offer map
when the unit has one. Use the shared catalog's canonical order only when no
published offer map is available. Append Training Academy as the explicit
review lane. The reusable feature receives the pathway from its page boundary;
it does not look up sample tenant fixtures itself. Offer-map types and
validation are also feature-owned; sample data only provides demo records.
The launch resolver and front-door resolver are the sample-provider boundary:
they may translate a demo package into an offer map, while the reusable
student route cards and game shells receive the map by dependency injection.

## Consequences

White-label tenants can control their reviewed mode order and labels through
data while retaining one component and one parent-engine contract. The
fallback prevents incomplete units from rendering an empty pathway, but it
does not grant publication, assignment, or persistence authority. Removing
fixture lookup from reusable route components keeps future hosted, local, and
partner package providers interchangeable.

## Verification

Run `npm run typecheck --workspace @living-textbook/web`,
`npm run verify:routes`, and the complete `npm run verify:foundation` suite.
