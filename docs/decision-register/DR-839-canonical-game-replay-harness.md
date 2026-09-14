# DR-839: Canonical Game Replay Harness

Every active canonical game mode must pass a deterministic synthetic replay
through the shared event validator. The replay must carry the mode's scoring
profile, dust cap, target-language audio, replay-v1 seed, tenant/unit/launch/
student identity, and ordered completion evidence.

This is foundation verification only. It does not create learner routes,
write persistence, award Star Dust, replace visual or browser tests, or
authorize Phaser source promotion. See ADR 0762.
