# DR-740: Canonical Game Event Chronology

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Canonical game integration / replay integrity

The shared canonical game validator now requires valid, nondecreasing
`occurredAt` timestamps. Out-of-order or invalidly timestamped game evidence
is blocked before completion, teacher-report readiness, or future wrapper
promotion. See `docs/adr/0668-canonical-game-event-chronology.md`.
