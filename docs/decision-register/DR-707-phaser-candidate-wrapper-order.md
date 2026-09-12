# DR-707: Phaser Candidate Wrapper Order

**Date:** 2026-09-12  
**Decision:** Review Memory Match first; review Balloon Pop second.  
**Scope:** Frozen Z.ai Phaser suite intake.

## Why

Memory Match gives us the smallest clear test of the platform boundary: show a round, receive two selections, record an attempt, return a result, and complete after the required pairs. Balloon Pop is valuable but adds movement, timing, missed targets, and escape semantics that should be reviewed after the basic wrapper pattern is proven.

## Non-negotiable conditions

- No direct source import into `apps/web` or `apps/ai-service` yet.
- Platform owns identity, events, scoring, mastery, audio language, persistence, reporting, and rewards.
- Phaser owns presentation and interaction only through an adapter.
- Deterministic replay evidence is required before integration approval.
- Any random reward or MiniStar-specific persistence remains disabled in the platform path.

## Human review signal

The next approval request should be made only after the Memory Match review packet and deterministic fixture exist. A human should then confirm the candidate behavior on a touch device before an integration green light is issued.
