# DR-1166: Shared Pairing Skin Ordering

Decision: Memory Match, Match Up, and future pairing skins must consume one
shared replay-seeded card-order helper. The helper uses an explicit card-ID
tie-breaker and preserves every card once.

Ordering is presentation-only. Scoring, audio policy, progression,
persistence, tenant configuration, and rewards remain platform-owned. Frozen
Z.ai/Phaser source remains isolated until its evidence packet is reviewed.

Evidence: `pairingEngineState.ts`, the Memory Match and Match Up wrappers,
`scripts/verify-pairing-engine-runtime.mjs`, ADR 1166, and build session 1080.
