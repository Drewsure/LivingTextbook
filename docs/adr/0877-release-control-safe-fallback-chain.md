# ADR 0877: Release-Control Evidence In The Safe-Fallback Chain

## Status

Accepted for foundation rehearsal.

## Context

Safe fallback planning covers printed QR pauses, child-safe messages, local
companion behavior, media pauses, and restoration. Those previews could still
drift from the release-control evidence used by policy and rollback review.

## Decision

Carry the exact release-control evidence from the rollback impact matrix into
the safe-fallback plan, then through fallback preflight, activation preview,
and restoration preview. Surface the binding identity, decision, and blockers
without enabling fallback activation or restoration.

## Consequences

Every fallback artifact is traceable to the same release state. No QR redirect,
notification, media change, local deactivation, learner-data operation,
assignment change, classroom shutdown, fallback activation, or restoration is
enabled by this chain.
