# DR-739: Canonical Game Report Evidence

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Teacher reporting / canonical game integration

Teacher report evidence now groups canonical learning events by unit, launch,
learner session, and game mode and validates each group with the shared game
sequence contract. Incomplete, cross-tenant, or replay-incomplete groups are
blocked from authoritative report status. Support-only media and audio remain
separate evidence lanes. See `docs/adr/0667-canonical-game-report-evidence.md`.
