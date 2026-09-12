# ADR 0660: Runtime Replay Evidence Gate

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

The canonical game event-sequence validator requires every required learning
event and every `audio_requested` event to carry a replay seed beginning with
`replay-v1:`. This is enforced at runtime in the shared content model, not
only by source-level integration checks.

## Rationale

Replay identity is needed to reproduce scoring, ordering, audio coverage, and
completion evidence. A component can appear to call the correct helpers while
an adapter or future wrapper drops the metadata. The shared validator must
reject that loss at the completion boundary.

## Consequences

- Canonical routes receive one consistent replay-evidence gate.
- Future Phaser wrappers cannot pass completion review if their adapter drops
  replay identity.
- Existing demo events must include replay metadata, with no change to reward
  randomness, persistence, or source promotion.
