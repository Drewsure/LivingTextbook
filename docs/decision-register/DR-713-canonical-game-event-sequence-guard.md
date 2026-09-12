# DR-713: Canonical Game Event Sequence Guard

**Status:** Accepted

The canonical DOM game routes now share a completion-time event sequence guard.
It requires one deterministic learning sequence, paired answer submission and
result events, exactly one start/completion/mastery event, and a prohibition on
support-language progress unlocks through game metadata.

This strengthens the integration boundary for future Phaser wrappers without
importing frozen source or granting a prototype authority over score, rewards,
routes, persistence, or assignments.

Verification is included in `verify:canonical-games` and the full foundation
verification chain.
