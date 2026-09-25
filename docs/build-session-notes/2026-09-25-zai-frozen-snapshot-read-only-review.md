# Build Session: Z.ai Frozen Snapshot Read-Only Review

## Scope

Read-only review of the isolated snapshot at
`zai-review/ministar-lab-frozen-2026-09-12-aaa-stable`. No source was copied,
executed as part of LivingTextbook, or exposed through a canonical route.

## Provenance evidence

- Repository: `Drewsure/ministar-lab`
- Branch: `main`
- Frozen tag: `frozen-2026-09-12-aaa-stable`
- Commit: `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`
- Frozen source hash verification: 5/5 manifest entries matched.
- Snapshot inventory: eleven prototype folders plus a shared Phaser scene tree.
- `src/game/scenes/MemoryMatchScene.ts` is present and extends the shared
  `BaseEngine`.

## Findings

### Promising compatibility

- Memory Match is a real Phaser scene, not only a static page.
- The scene already has a clear pairing interaction, touch-oriented card hit
  testing, visible moves/pairs feedback, and learning-audio hooks.
- The shared scene tree already separates a base engine from individual game
  scenes, which is useful source material for a future wrapper proposal.

### Blocking compatibility findings

- `src/game/BaseEngine.ts` owns score, attempts, streak, completion, and
  student-facing collection behavior. LivingTextbook must remain the owner of
  canonical scoring, mastery, Star Dust, rewards, persistence, and reporting.
- `src/game/BaseEngine.ts` and `src/app/page.tsx` read and write browser
  storage for stickers, settings, and progression-like state. This violates
  the candidate rejection rule until the behavior is removed or isolated as a
  host-provided view preference.
- `src/lib/telemetry.ts` creates actor identity in browser storage and posts
  directly to `/api/telemetry/verify`. A wrapper candidate must emit the
  canonical event adapter instead of dispatching telemetry itself.
- `MemoryMatchScene.ts` uses Phaser shuffle/random positioning. A candidate
  package must prove deterministic ordering from the supplied replay seed;
  visual decoration randomness must not affect answer order or scoring.
- The shared source contains a pirate-themed mascot entry in `BaseEngine.ts`,
  which conflicts with the LivingTextbook visual blacklist unless it is
  demonstrably unreachable and removed from the candidate surface.
- The prototype documentation says there is no browser storage in one
  prototype, while the shared runtime does use browser storage. The returned
  package must resolve this documentation/source contradiction explicitly.
- The snapshot build review records Phaser scenes as Phase 2 unverified. A
  frozen-source hash is provenance evidence, not gameplay, accessibility,
  audio, or wrapper evidence.

## Decision

**Memory Match remains the first approved candidate, but the frozen snapshot is
not integration-ready.** The source is valuable reference material and remains
isolated. No wrapper, route write, score change, package promotion, student
assignment, or persistence activation is authorized.

## Required Z.ai return before wrapper review

Z.ai must return the evidence package described in
`docs/agent-briefs/ZAI_MEMORY_MATCH_EVIDENCE_REQUEST.md`, with specific proof
that:

1. canonical state ownership is outside the Phaser scene;
2. browser storage and direct telemetry dispatch are removed or disabled;
3. pair ordering is deterministic from the replay seed;
4. all learner-facing cues have reviewed target-language audio coverage;
5. event replay, scoring replay, keyboard/touch, reduced-motion, and
   small-screen evidence are complete; and
6. source, assets, dependencies, and rights are fully identified.

The package must be placed outside the LivingTextbook repository and must
contain `evidence/return-package.json` before the candidate verifier can run.
