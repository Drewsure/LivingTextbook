# ADR 0171: Earned Collection Room Route

Date: 2026-07-12

## Status

Accepted

## Context

The platform needs strong progression and collection mechanics for student motivation, but visual polish and premium avatar art should not come before clean structure. Rewards also must remain child-safe and mastery-driven.

## Decision

Add `/collection/[code]` as an active scaffold for deterministic earned collection items.

The route shows current reward progress, next unlock, and collection categories such as badges, titles, cosmetics, room items, companion evolution, palettes, and power-ups. It explicitly rejects random pressure loops and paid gacha-like mechanics.

## Consequences

The student engagement model now has a visible structural home before premium art. Future avatar rooms, pet/mascot evolution, and micro-interactions can build on this route without changing the reward economy rules.
