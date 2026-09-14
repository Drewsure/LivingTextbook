# DR-811: Shared Replay-Seed Factory Boundary

Require shared progression factories to normalize provider-supplied replay
seeds through the canonical `replay-v1` resolver before creating game-start,
interaction, audio, or completion evidence. Invalid seeds fall back to the
deterministic unit/mode seed, keeping browser and future Phaser adapters
replay-compatible without authorizing live writes or source promotion.
