# Z.ai MiniStar Lab Suite Inventory

**Source:** `Drewsure/ministar-lab`

**Frozen source:** `frozen-2026-09-12-aaa-stable`

**Commit:** `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`

**Review state:** Inventory complete; compatibility review open; integration
blocked.

## Confirmed Frozen Structure

The extracted frozen snapshot contains:

- 32 Phaser scene files under `src/game/scenes`.
- 32 game-mode catalog entries under `src/lib/gameModes.ts`.
- 32 mode-to-scene mappings in `src/components/ministar/GameCanvas.tsx`.
- A shared Phaser `BaseEngine` with HUD, input, audio, telemetry, effects,
  completion, and pause behavior.
- A shared Web Audio and browser TTS service.
- xAPI-style event generation and a server verification endpoint.
- Existing QA, pacing, smoke-test, and build-review documents.

## Game Families Observed

### Pairing And Vocabulary

- Memory Match
- Match Up
- Balloon Pop
- Whack-a-Mole
- Flash Cards
- Group Sort
- Label It

### Selection And Arcade

- Maze Chase
- Quiz
- Airplane
- Gameshow
- Spot It
- Endless Runner
- Physics Puzzler
- Snaking
- Training Academy
- Rescue Quest
- Monster Fighter
- Tower Defense
- Rhythm Tap
- Space Explorer
- Treasure Hunt

### Text And Spelling

- Anagram
- Word Search
- Bridge Builder
- Crossword
- Type Answer

### Narrative And World-Building

- Story Adventure
- Farm Life
- Star Farm

## Review Findings

1. The source is materially larger than the summary documents claim. The
   frozen source has 32 scene files and 32 catalog entries, while
   `BUILD_SUMMARY.md` still describes 25 games and `GameCanvas.tsx` retains an
   old “all 11 game scenes” comment. This must be reconciled before an
   integration plan names a final catalog.
2. `BaseEngine` is a useful extraction point because it centralizes common
   gameplay lifecycle behavior. It is not yet a LivingTextbook parent-engine
   wrapper because it owns local score mutation, completion presentation,
   telemetry posting, browser storage, and reward-adjacent effects.
3. The candidate uses direct browser `localStorage` for actor identity,
   settings, sticker collection, Star Dust, garden state, adaptive state, and
   some game saves. These are review evidence only and cannot become the
   platform persistence layer.
4. The candidate posts directly to its own `/api/telemetry/verify` and exposes
   other API surfaces for authoring, brand resolution, multiplayer, and arena
   play. These require a quarantine boundary before any LivingTextbook route or
   backend contract is considered.
5. The audio layer provides synthesized SFX and browser TTS. This is valuable
   as a fallback, but it does not yet prove the LivingTextbook target-language
   audio manifest, tap-to-speak coverage, support-language policy, or tenant
   voice rules.
6. Training Academy and Rescue Quest use browser speech recognition. They are
   promising optional candidates, but microphone approval, provider cost,
   privacy, failure fallback, and teacher entitlement gates remain required.
7. Spin Wheel, mystery-box, and random-reward surfaces require adaptation to
   LivingTextbook's earned, deterministic, child-safe collection rules.
8. The frozen source includes pirate-themed Treasure Hunt presentation. That
   conflicts with the MiniStar blacklist and must remain tenant-configurable or
   be removed from a MiniStar pathway.

## First Candidate Review Order

1. **Balloon Pop:** first Phaser wrapper candidate. It exercises motion,
   collision/input, short vocabulary prompts, audio feedback, deterministic
   answer events, and the Pairing parent engine.
2. **Memory Match:** second candidate. It maps directly to the early learner
   pathway and tests whether the Phaser presentation can preserve the existing
   pairing semantics, audio-first behavior, and completion reporting.
3. **Label It:** third candidate. It tests teacher image assets, label anchors,
   rights, and compatibility with the upload/evidence foundations.
4. **Speak It or Rescue Quest:** later voice candidate, gated by microphone and
   premium-cost policy.

## Current Decision

The suite is accepted as a rich prototype inventory, not as a production
engine. The first integration proposal must wrap one candidate around a
LivingTextbook parent-engine contract and remove direct authority over schema,
scoring, mastery, rewards, persistence, routes, and assignments.
