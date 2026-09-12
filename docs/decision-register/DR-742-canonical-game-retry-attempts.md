# DR-742: Canonical Game Retry Attempts

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Teacher reporting / canonical game integration

Repeated plays of the same game mode are now split at each subsequent
`game_started` event and validated independently. This preserves classroom
retries, keeps incomplete attempts visibly blocked, and prevents duplicate
events from corrupting teacher-report evidence. See
`docs/adr/0670-canonical-game-retry-attempts.md`.
