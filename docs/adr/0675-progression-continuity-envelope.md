# ADR 0675: Provider-Neutral Progression Continuity Envelope

## Decision

Introduce a shared, provider-neutral progression continuity envelope for
carrying reviewed student progression between routes. Keep its runtime adapter
review-only until storage, identity, policy, reporting, recovery, and release
decisions are approved.

## Rationale

The route gate correctly prevents a direct game URL from unlocking itself, but
the next route still needs a safe way to receive the earned unlock from the
flashcard entry flow. A URL query string is too easy to tamper with and would
couple progression to QR/link transport. A fake local-storage implementation
would imply live learner persistence before the backend and school policy are
ready.

The envelope validates identity, progression invariants, supported modes,
timestamps, event position, and privacy exclusions. The adapter then keeps the
current product boundary explicit: validation is available, mutation is not.

## Consequences

- Flashcard-to-game continuity now has a documented shared shape.
- Cross-tenant, cross-package, cross-launch, and cross-session reuse is
  rejected.
- Support-language, media-only, raw audio, and transcript data cannot authorize
  progression through this path.
- No live persistence or route behavior is enabled by this decision.
- A future storage adapter must satisfy the same envelope and all platform
  policy gates before production use.
