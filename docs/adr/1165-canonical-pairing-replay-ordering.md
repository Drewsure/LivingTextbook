# ADR 1165: Canonical Pairing Replay Ordering

Status: Accepted

## Context

Memory Match card order is derived from the canonical replay seed. Equal sort
keys are possible because the compact deterministic key intentionally reduces
the value space. Relying on the runtime's sort stability would make identical
replays depend on browser or engine behavior.

## Decision

Use the seeded order key first and the canonical card identity second. The
pairing scene owns presentation order only; platform-owned events, scoring,
mastery, rewards, persistence, and tenant policy remain outside the scene.

## Consequences

- The same unit, game mode, and replay seed produce a stable card identity
  sequence across supported runtimes.
- No random reward or hidden state is introduced.
- The rule can be reused by future pairing skins without importing Phaser
  source or changing the canonical route boundary.

## Verification

- `npm run verify:pairing-engine-runtime`
- `npm run verify:canonical-games`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`
