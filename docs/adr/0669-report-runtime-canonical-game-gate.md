# ADR 0669: Report Runtime Canonical Game Gate

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

The provider-neutral teacher report runtime must validate canonical game
evidence whenever a report request contains canonical learning-game event
envelopes. It maps those envelopes into the shared game event shape and applies
the canonical report evidence validator before any future hosted, local, or
hybrid adapter may treat game rows as authoritative.

## Rationale

The teacher UI and report preview are not the final enforcement boundary. A
future provider could otherwise accept structurally valid envelopes while
omitting a complete game sequence, replay identity, tenant binding, or launch
binding. Support-only audio remains valid without a game sequence and is not
promoted into learning evidence.

## Consequences

- Report adapters share the same canonical game integrity rule as student
  completion and teacher previews.
- Incomplete or cross-tenant game envelopes fail report-runtime validation.
- Standalone `audio_requested` envelopes remain support-only and do not require
  a game sequence.
- No report export, persistence, or provider activation is introduced.
