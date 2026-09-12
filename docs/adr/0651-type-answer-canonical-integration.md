# ADR 0651: Type Answer Canonical Integration

**Status:** Accepted  
**Date:** 2026-09-13

## Decision

Type Answer is promoted into the canonical DOM game integration set. It must
use the shared text-spelling engine boundary, route shell, progression
adapter, audio event contract, deterministic replay seed, and completion
validation boundary.

## Rationale

Typed response is a higher-effort learner action than selection and exposes
important boundaries around input ownership, retry behavior, target-language
authority, and deterministic scoring. Promoting it now prevents later spelling
variants from inventing their own completion semantics.

## Boundaries

- Answers are checked against reviewed vocabulary only.
- Incorrect attempts remain visible in evidence but do not earn mastery credit.
- Audio supports the learner and evidence stream but never unlocks progress.
- No AI generation, live persistence, random reward, or Phaser promotion is
  enabled by this slice.
