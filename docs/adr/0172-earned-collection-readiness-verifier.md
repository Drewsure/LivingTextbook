# ADR 0172: Earned Collection Readiness Verifier

Date: 2026-07-12

## Status

Accepted

## Context

The collection room route gives reward mechanics a visible product surface. Future premium work around avatars, rooms, mascot evolution, and animation could accidentally introduce random-pressure mechanics if collection is only protected by documentation.

## Decision

Add `npm run verify:collection` and include it in `npm run verify:foundation`.

The verifier checks reward categories, collection routes, no-random/no-gacha page copy, and the principles requiring earned collection.

## Consequences

Reward and collection changes now have an automated foundation check. Premium avatar, room, mascot, and animation work must preserve deterministic mastery-earned unlocks.
