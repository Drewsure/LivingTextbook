# ADR 0689: Front-Door Pairing Slice Integration

## Status

Accepted

## Context

The canonical QR launch flow already supported the reviewed Match Up and
Memory Match wrappers. The front-door flow mounted Memory Match only, which
left a partner tenant whose first recommended activity was Match Up on a
preview-only path. That made the white-label entry experience depend on which
tenant happened to be selected.

## Decision

The front door mounts the canonical `PairingMatchUpGame` when the selected mode
is `match-up` and `PairingMemoryMatchGame` when it is `memory-match`. Both use
the same parent-selection gate, audio evidence adapter, deterministic scoring,
progression adapter, synchronous event reference, and canonical completion
gate. Other modes remain explicit previews until their reviewed wrapper is
selected for this surface.

## Consequences

- MiniStar and partner tenants receive the same first-class pairing pathway.
- The first canonical game slice is reusable across QR and front-door entry.
- Unreviewed modes remain visible without being accidentally promoted to live
  completion behavior.
- No Z.ai/Phaser source is imported or activated by this decision.

## Verification

- Canonical integration verification requires both pairing wrappers in the
  front-door flow.
- Web typecheck and production webpack build pass.
