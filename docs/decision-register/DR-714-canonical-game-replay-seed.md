# DR-714: Canonical Game Replay Seed

**Status:** Accepted

Canonical Memory Match and Balloon Pop routes now record a stable replay seed
derived from their unit key and game mode. This creates a platform-owned replay
boundary for comparing future Phaser scenes without importing their random
ordering, timing, persistence, scoring, or reward behavior.

The seed is evidence metadata only. It does not grant a prototype route,
student assignment, score authority, or reward authority.
