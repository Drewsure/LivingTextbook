# Build Session: Canonical Game Replay Seed

The canonical Memory Match and Balloon Pop reference routes now derive a stable
`replay-v1` seed from the unit key and game mode. The seed is recorded when the
game starts, when rounds are shown, and when the game completes.

This hardens the comparison point for frozen Z.ai/Phaser candidates. It makes
determinism inspectable without importing scene code or allowing a game view to
own scoring, rewards, persistence, or tenant identity.
