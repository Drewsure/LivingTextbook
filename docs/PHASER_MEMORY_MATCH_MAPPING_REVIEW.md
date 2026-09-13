# Phaser Memory Match Mapping Review

Status: Review-only mapping; integration not approved

## Review Identity

- Source repository: `Drewsure/ministar-lab`
- Frozen source folder: `D:\LIVING TEXTBOOOK PROJECT\zai-review\ministar-lab-frozen-2026-09-12-aaa-stable`
- Frozen branch: `main`
- Frozen commit: `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`
- Candidate scene: `src/game/scenes/MemoryMatchScene.ts`
- Parent scene base: `src/game/BaseEngine.ts`
- Review boundary: no source files are copied, imported, or exposed through a
  student route by this document.

## What Maps Well

The candidate is a strong first visual candidate for the canonical pairing
engine because it has a clear two-card pair loop, a bounded round count, and a
simple match/mismatch outcome.

- `maxQuestions()` limits the candidate to at most eight selected terms, which
  aligns with the canonical eight-term default for an early learner unit.
- Each pair has a stable pair identifier inside the scene, with a term card and
  a definition or emoji card.
- Card taps speak the visible card text before the card flips.
- The scene exposes clear match, mismatch, move-count, and pair-count states.
- Responsive card sizing is calculated from the available scene dimensions,
  which is useful evidence for a mobile-first wrapper.
- The visual treatment can be retained as a presentation concept while the
  tenant theme, fonts, sprites, and sounds are supplied by the platform.

## Required Replacement Boundaries

The following source behavior cannot cross into the canonical application
unchanged.

### Replay and determinism

`MemoryMatchScene.ts` uses `Phaser.Utils.Array.Shuffle` and a `Math.random()`
entry animation. `BaseEngine.ts` also uses random selection in shared effects.
The wrapper must instead receive the route-shell `replaySeed` and use a
deterministic, platform-reviewed layout plan. The same seed must appear in
start, round, answer, audio, mastery, and completion evidence.

### Scoring and progression

The candidate calls scene-owned `recordAnswer()` and `finishGame()`, maintains
its own score, and calculates legacy XP, tokens, stars, and badges. None of
those values may authoritatively update LivingTextbook progression. The wrapper
must translate verified outcomes into the canonical event taxonomy and use the
platform scoring profile for Star Dust, mastery, unlocks, rewards, and reports.

### Persistence and identity

`BaseEngine.ts` contains browser `localStorage` paths for stickers, slow mode,
extended time, and related preferences. The candidate also relies on a Phaser
registry launch config. The canonical wrapper must not allow scene-owned
browser persistence or actor identity. Tenant, unit, launch, student-session,
assignment, and policy identity come from the platform boundary.

### Audio

The candidate uses a direct `audioBus` for effects and TTS helpers for card
speech. This is promising for the audio-first learner experience, but it must
be mapped to canonical audio cues and policy. Every visible learner-facing
term, instruction, feedback label, and critical control requires an audio
source or approved text-to-speech fallback. Audio is support evidence and must
not unlock a game or progression by itself.

### Tenant and visual policy

The candidate's scene title, font family, emoji fallback, sound names, and
visual effects are source-owned defaults. They must become tenant-configured
theme inputs. MiniStar motifs may be supplied by the MiniStar tenant, but they
must not become universal white-label requirements.

### Lifecycle and accessibility

The scene uses delayed callbacks and `setTimeout()` for flip transitions. A
wrapper must prove cleanup on unmount, route change, reduced motion, and rapid
repeat input. Canvas interaction must also be accompanied by keyboard/focus,
screen-reader, touch-target, and non-audio feedback evidence before approval.

## Required Evidence Before Integration

The candidate remains blocked until its isolated return package contains all
of the following, validated by the package gate:

1. Canonical fixture using the shared unit payload and tenant identity.
2. Standard event replay with one valid `replay-v1:` seed.
3. Deterministic scoring replay covering correct, incorrect, repeat, and
   completion paths.
4. Audio map covering terms, instructions, feedback, and critical controls.
5. Mobile and accessibility evidence, including reduced-motion behavior.
6. Source manifest tied to the frozen source identity and reviewed file set.
7. Phaser wrapper notes showing platform-owned lifecycle and event boundaries.
8. README covering dependencies, controls, asset rights, and known limits.

The required handoff format is defined in
`docs/agent-briefs/ZAI_MEMORY_MATCH_EVIDENCE_REQUEST.md`. A manifest or a
working deployment alone is insufficient evidence.

## Recommendation

Proceed with Memory Match as the first Phaser wrapper candidate only after the
complete evidence packet is returned and passes the candidate package gate.
Retain the candidate's card interaction and visual ideas as implementation
inspiration, but rebuild the integration around the canonical route shell,
content model, audio contract, scoring profile, progression adapter, and
tenant policy. Do not copy the frozen scene into `apps/web` or
`apps/ai-service`.
