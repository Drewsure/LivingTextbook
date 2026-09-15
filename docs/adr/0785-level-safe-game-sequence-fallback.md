# ADR 0785: Level-Safe Game Sequence Fallback

## Status

Accepted

## Decision

When a curated unit game offer map is unavailable, `GameSequence` filters the
canonical mode order through each mode's `supportedLevels` catalog property
before presenting the fallback sequence.

## Rationale

The fallback exists for structural resilience, not for bypassing curriculum
design. A Level 1 learner should not see a higher-level syntax mode merely
because a package has not supplied its reviewed offer map. Keeping the filter
at the presentation boundary complements the deeper route and progression
guards.

## Consequences

- Fallback sequences remain deterministic and level-appropriate.
- Curated offers remain authoritative when present.
- Audio, progression, offer, and direct-route gates are unaffected and remain
  required.
- This is a foundation safety change only; it does not enable live services or
  promote external Phaser source.
