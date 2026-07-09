# ADR 0062: Quiz Selection Playable Slice

## Status

Accepted

## Context

The Living Textbook build has playable pairing, text-spelling, and speaking/listening routes. Selection existed as a preview and as future arcade modes, but not yet as a simple playable route.

## Decision

Add `/quiz/[code]` as the first playable selection route and expose it as a ready optional game offer.

## Consequences

Quiz becomes the baseline for selected-response game events and deterministic scoring. Arcade skins should build on this contract after the baseline is verified.
