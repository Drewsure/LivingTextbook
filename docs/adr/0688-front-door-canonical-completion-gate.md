# ADR 0688: Front-Door Canonical Completion Gate

## Status

Accepted

## Context

The front-door demo mounts the same canonical Memory Match wrapper used by
standalone and QR launch surfaces. Its completion callback previously accepted
the wrapper result directly, so this launch surface could bypass shared
chronology, identity, audio, replay, scoring, and award-consistency checks.

## Decision

The front-door completion callback must call
`validateCanonicalGameCompletion` with the synchronously accumulated event
evidence, the active game mode, tenant identity, launch identity, and proposed
progression result. No progression, completion award, or report event is
accepted when the gate fails. The event reference is updated synchronously so
the final mastery evidence emitted immediately before the callback is included
in validation.

## Consequences

- Front-door, QR, and standalone canonical game routes share one acceptance
  boundary.
- Invalid or incomplete evidence pauses completion instead of mutating local
  progression.
- Teacher reports cannot receive an accepted front-door completion that was not
  replay-verified.
- No durable persistence or Z.ai/Phaser source integration is introduced.

## Verification

- Canonical integration verification checks the front-door gate and event
  reference.
- Web typecheck and production webpack build pass.
