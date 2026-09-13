# ADR 0687: Front-Door Game Start Ownership

## Status

Accepted

## Context

The QR launch flow already lets the mounted canonical game emit its single
`game_started` event. The front-door demo previously emitted a start event in
its mode-selection handler and then mounted Memory Match, whose wrapper emitted
another start event. That created duplicate attempt evidence and made the two
launch surfaces behave differently.

## Decision

Every launch surface follows one ownership rule: the parent route selects and
gates the unlocked mode, while the mounted game wrapper owns the single
`game_started` event. The front door must not call `startUnlockedGameMode`.
Locked or preview-only modes produce no game start evidence.

## Consequences

- Front-door and QR launch flows share the same canonical event contract.
- Teacher reports receive one unambiguous attempt boundary per game wrapper.
- Future DOM, canvas, or Phaser wrappers can be integrated without inventing a
  second start-event path.
- Mode selection remains UI state; scoring and event authority remain inside
  the canonical game wrapper and shared progression adapter.

## Verification

- Canonical game verification rejects `startUnlockedGameMode` in the front-door
  flow and the QR launch flow.
- Web typecheck and production webpack build pass.
