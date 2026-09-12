# DR-717: Canonical Game Scoring Boundary

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Canonical game integration / progression

## Decision

The canonical game shell validates deterministic scoring at completion. The
`mastery_updated` award must equal the `game_completed` award and the award
returned by the progression adapter. Each mastery event must also identify its
scoring profile.

## Consequences

- Student, teacher, and later persistence layers receive one authoritative
  award value.
- A malformed or dishonest external game wrapper is surfaced as a contract
  review error instead of being silently repaired.
- New game modes must emit the shared mastery fields before they can be
  promoted to canonical integration.
- The frozen Phaser snapshot is not promoted by this change.
