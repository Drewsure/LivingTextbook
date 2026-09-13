# Phaser Balloon Pop Mapping Review

Status: Review-only mapping; integration not approved

## Review Identity

- Source repository: `Drewsure/ministar-lab`
- Frozen source folder: `D:\LIVING TEXTBOOOK PROJECT\zai-review\ministar-lab-frozen-2026-09-12-aaa-stable`
- Frozen branch: `main`
- Frozen commit: `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`
- Candidate scene: `src/game/scenes/BalloonPopScene.ts`
- Parent scene base: `src/game/BaseEngine.ts`
- Review boundary: no source files are copied, imported, or exposed through a
  student route by this document.

## What Maps Well

Balloon Pop is a useful second external candidate because it explores a
different interaction profile from the pairing-first Memory Match review.

- A balloon carries a reviewed vocabulary term and the learner times a pop.
- Definition boxes create a visible selection target and a clear correct or
  incorrect outcome.
- The scene provides immediate feedback, target-language prompt speech, and a
  visible motion loop that could become a selection-engine skin.
- The source has a bounded term pool and a repeatable round concept that can be
  mapped to the canonical 8-12 term unit payload.
- The visual idea can be tenant-themed without making MiniStar motifs a
  universal requirement.

## Required Replacement Boundaries

The following source behavior cannot cross into the canonical application
unchanged.

### Replay and determinism

`BalloonPopScene.ts` uses `Phaser.Utils.Array.Shuffle`,
`Phaser.Utils.Array.GetRandom`, and `Math.random()` for round selection,
balloon selection, color selection, and motion setup. The wrapper must receive
the route-shell `replaySeed` and use a deterministic, platform-reviewed round
and layout plan. The same seed must appear in start, round, answer, audio,
mastery, and completion evidence.

### Scoring and progression

The scene calls `recordAnswer()` and `finishGame(true)` and relies on
scene-owned score, combo, `currentRound`, and `maxScore` state. Correct timing,
misses, and wrong landings may be retained as interaction evidence, but Star
Dust, mastery, unlocks, rewards, and teacher reporting must come from the
canonical selection-engine scoring profile and completion adapter.

### Persistence and identity

`BaseEngine.ts` owns browser `localStorage` preferences and Phaser registry
launch configuration. The canonical wrapper must not allow scene-owned
identity, persistence, stickers, slow mode, or extended-time settings to become
the platform record. Tenant, unit, launch, student-session, assignment, and
policy identity come from the platform boundary.

### Audio

The candidate calls `audioBus.play`, `audioBus.speak`, and
`speakPromptWithHighlight` directly. These are useful interaction clues, but
they must be replaced by the canonical audio cue manifest and policy. Every
visible learner-facing term, instruction, feedback label, and critical control
requires an audio source or approved text-to-speech fallback. Audio remains
support evidence and cannot unlock or score a game by itself.

### Lifecycle and input accessibility

The scene uses delayed callbacks, `setTimeout`, tweens, and a global pointer
dispatcher. A wrapper must prove cleanup on unmount, route change, reduced
motion, rapid repeat input, and escaped balloons. Canvas interaction must be
accompanied by semantic keyboard/focus controls, screen-reader status, touch
targets, and non-audio feedback. Fixed prompt and box dimensions must be
replaced by responsive layout constraints for small screens.

### Tenant and content policy

Hard-coded English instructions, emoji/symbol labels, Inter font defaults,
source-owned colors, and definition rendering must become tenant-configured
presentation inputs. The wrapper must validate the shared unit payload,
target-language policy, reviewed term/definition relationship, and allowed
background-media rule before mounting.

## Required Evidence Before Integration

The candidate remains blocked until its isolated return package contains all of
the following, validated by the package gate:

1. Canonical fixture using the shared unit payload and tenant identity.
2. Standard event replay with one valid `replay-v1:` seed.
3. Deterministic scoring replay covering correct, incorrect, miss, retry, and
   completion paths.
4. Audio map covering terms, instructions, feedback, and critical controls.
5. Mobile and accessibility evidence, including reduced-motion behavior.
6. Source manifest tied to the frozen source identity and reviewed file set.
7. Phaser wrapper notes showing platform-owned lifecycle and event boundaries.
8. README covering dependencies, controls, asset rights, and known limits.

The required handoff format is defined in
`docs/agent-briefs/ZAI_MEMORY_MATCH_EVIDENCE_REQUEST.md`; the same packet
shape applies to this second candidate after its own task brief is issued. A
working deployment or source freeze alone is insufficient evidence.

## Recommendation

Keep Balloon Pop as the second external candidate after Memory Match. Preserve
its timing-and-targeting idea for a future selection-engine wrapper, but do not
copy the frozen scene into `apps/web` or `apps/ai-service`, and do not let its
scene-owned randomization, scoring, audio, persistence, or identity bypass the
canonical contracts.
