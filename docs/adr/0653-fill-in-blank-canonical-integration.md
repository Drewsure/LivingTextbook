# ADR 0653: Fill in the Blank Canonical Integration

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Fill in the Blank is promoted into the canonical DOM game integration set. It
must use the shared text-spelling engine boundary, route shell, progression
adapter, audio event contract, deterministic replay seed, and completion
validation boundary.

## Rationale

Sentence-context selection is the bridge between vocabulary review and full
sentence construction. Promoting it now verifies that syntax review can use
reviewed sentence payloads, target-language audio, bounded retries, and the
same completion contract without a separate game-specific progression path.

## Boundaries

- Missing words and decoys are derived from reviewed content only.
- Incorrect attempts remain visible in evidence but do not earn mastery credit.
- Audio supports the learner and evidence stream but never unlocks progress.
- No AI generation, live persistence, random reward, or Phaser promotion is
  enabled by this slice.
