# DR-1165: Canonical Pairing Replay Ordering

Decision: canonical pairing card layouts must use the platform replay seed and
an explicit card-identity tie-breaker. Equal seeded keys must never defer to
browser-specific sort stability.

This is a presentation determinism rule only. Scoring, mastery, Star Dust,
collection, persistence, tenant policy, and student assignment remain
platform-owned. Frozen Z.ai/Phaser source remains isolated and review-only.

Evidence: `apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx`,
`scripts/verify-pairing-engine-runtime.mjs`, ADR 1165, and build session 1079.
