# DR-748: Standalone Report Audio Boundary

The teacher report canonical-game helper now ignores an events-only stream of
`audio_requested` support evidence instead of treating it as an incomplete
game. This keeps required tap-to-speak engagement separate from game attempts,
mastery, Star Dust, and completion reporting. See ADR 0676.
