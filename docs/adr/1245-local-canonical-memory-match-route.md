# ADR 1245: Local Canonical Memory Match Route

## Status

Accepted for the first white-label pilot foundation.

## Context

The local package now has separate metadata and content readers, but no game
route consumes the approved package content. A local-only game implementation
would duplicate scoring, audio, and progression rules and would create drift
from the hosted experience.

## Decision

Add a package-scoped Memory Match route that reads approved local content and
reuses `MemoryMatchDemoFlow`. It creates a package-bound launch session and a
completed-entry-practice rehearsal state so the canonical game can be tested
without bypassing the entry gate in the game engine. The route does not use
the sample resolver and does not activate hosted persistence or learner-data
storage.

## Consequences

- The first canonical game is now mapped to the local content lane.
- The local and hosted Memory Match implementations share scoring, audio,
  event, and completion behavior.
- The route remains a controlled rehearsal until real publisher content,
  printed QR evidence, device testing, and launch policy are accepted.

