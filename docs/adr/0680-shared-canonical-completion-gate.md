# ADR 0680: Shared Canonical Completion Gate

Status: Accepted

Date: 2026-09-13

## Context

Standalone canonical game routes and the QR student launch pathway both need
to accept a game's completion only after the shared event contract passes. The
two surfaces had started to implement the same replay validation independently,
which made future rule changes easy to apply to one route and miss on another.

## Decision

Use `validateCanonicalGameCompletion` in
`apps/web/src/features/game-shell/canonicalGameCompletionGate.ts` as the single
application-layer completion boundary.

The gate:

- rejects a completion result without a completion event;
- filters buffered evidence to the expected game mode;
- appends the candidate completion event for validation;
- delegates event order, identity, replay, timestamp, and Star Dust checks to
  `validateCanonicalGameEventSequence`; and
- returns errors without changing progression when evidence is invalid.

Both `PlayableGameRouteShell` and `StudentLaunchFlow` must use this gate.

## Consequences

Positive:

- Standalone and in-page game completion cannot drift apart.
- Future Phaser wrappers receive one integration point for canonical acceptance.
- Mode filtering prevents unrelated launch, media, or support events from
  contaminating a game's replay evidence.

Tradeoffs:

- New game wrappers must learn the shared gate contract before completion work.
- The gate remains an application boundary; live persistence is still governed
  by the separate provider-neutral runtime and policy contracts.

## Verification

`npm run verify:canonical-games` checks the shared gate and both consumers.
