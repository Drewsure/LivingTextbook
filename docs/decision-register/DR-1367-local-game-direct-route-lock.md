# DR-1367: Local Game Direct-Route Lock

- Status: accepted
- Date: 2026-10-01
- Scope: local package Memory Match route and future package game routes

## Decision

Direct local package game URLs start from the initial progression snapshot.
They may become interactive only after the canonical client wrapper accepts a
validated session-storage handoff written by the package front door after
target-language entry practice.

## Why

The previous Memory Match route completed entry practice while rendering the
server page. That made a direct URL look like a valid learner progression path
and could bypass the QR/front-door contract. Package identity was also absent
from the game wrapper, so the handoff reader could not be enforced.

## Guardrails

- Entry completion remains owned by `FlashcardDemoFlow`.
- `PlayableGameRouteShell` remains the handoff validation boundary.
- Missing or invalid handoff renders the canonical access gate.
- No learner record or hosted persistence write is created by the route.

## Consequences

Teacher review URLs remain reachable for inspection, but a reviewer must use
the front door to rehearse the student path. A future persistent adapter may
replace session storage only under its separately accepted policy and contract.
