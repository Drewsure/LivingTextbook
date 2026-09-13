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

## Exact Active Scene Evidence Manifest

The following manifest is the observed active scene set in the extracted frozen
snapshot. It is evidence, not an import list. The hashes are SHA-256 values for
the exact files under `src/game/scenes` in snapshot commit
`eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`.

| Scene file | Bytes | SHA-256 |
| --- | ---: | --- |
| `AirplaneScene.ts` | 27622 | `1c1b60801beac23254750df5640c3c16110d98b77a4921b42e0b5a761599acbb` |
| `AnagramScene.ts` | 14049 | `478cb0fe0db15f17f7b5866e62b78defeb272c3548c9bb50231f136dfa3d20c1` |
| `BalloonPopScene.ts` | 14289 | `72904e8ad3a7760dda7779b93216975cd192a5c959b0b71d68c74efb926440e0` |
| `BridgeBuilderScene.ts` | 14093 | `44ea38d7c4a021d8cf2021beafa52c08e2e306fa9c196bcc8632dd329156d904` |
| `CrosswordScene.ts` | 25936 | `ebd375a0b15113bd26bf036cd93310ee34b8aa952ee4b4c108bb599679c1a357` |
| `EndlessRunnerScene.ts` | 11736 | `407a28d70ccdaccd02466c8b4ddee6b7e408fa26ff56d5409624cc805cdbe7bc` |
| `FarmLifeScene.ts` | 21559 | `ebf7a0877016685ca99fcad31595989304fde2cdd92003926151bdee0f7584b3` |
| `FlashCardsScene.ts` | 11202 | `482eb887105056dadc8e641d8ee7434e3ff972a36ec616cd7174597f60ffdf74` |
| `GameshowScene.ts` | 24254 | `9ec34fb216e418f9363b7ef72abe4916cb5c7ed08617d9a2987cebabe96d6a28` |
| `GroupSortScene.ts` | 11064 | `e5df321f11d4515425d1771db28269582819eebb2449c8f372b28100ac6901b6` |
| `LabelItScene.ts` | 3493 | `b08a85a2618b3261571048ee6ebf7957c9f66bf564059d9e0a586cf9bd57a2b1` |
| `MatchUpScene.ts` | 11259 | `4739f74d946d5a27b334d125890924d81995b42d3a87e44481ca9093b899e20c` |
| `MazeChaseScene.ts` | 43633 | `79175e5b02ef0445e8d3d6949576684bc8aca5b57fefcc6e0d7197ec89fda677` |
| `MemoryMatchScene.ts` | 13418 | `d1c60fa17bf4bee63627e485ae0b096894832705fdcf173576bf3b28b8656888` |
| `MonsterFighterScene.ts` | 17041 | `1e68426f97047701524b1067f314a726191b67d079fd4c8598e35fd107bedb85` |
| `PhysicsPuzzlerScene.ts` | 8894 | `f20a939ad1c89997e22922fea7825c795e5f8698003f005b139076cdb72ca482` |
| `QuizScene.ts` | 29474 | `177166098d0f7f098c1487d2bd5a58333d098fc9d499bc78a3e86b8cd7703ea0` |
| `RescueQuestScene.ts` | 8260 | `2d1e0e7dc4bdd7b6c2f01be8fd7247b3dc12de27f9c53773a340f639ddec005a` |
| `RhythmTapScene.ts` | 24827 | `d1a2d4f938aad755efde59472d523dc549bec90aa9dec3c0ad3cc5510d436041` |
| `SnakingScene.ts` | 23362 | `e2a5b01f596a536ebc3858211bfca84e9a8ad525898577c35f5772636828d9f9` |
| `SpaceExplorerScene.ts` | 15689 | `2b864b03eef08499fb90c55cfe5374ada366e60f4f2babcafd64b76d7938edcd` |
| `SpeakItScene.ts` | 5446 | `02e09b5d7b6349f513a99877cd186c0e12ace51f92d81e9224ddd34f3513a5cc` |
| `SpinWheelScene.ts` | 15270 | `6ea9e282f1053260c562d8e33bfc4844bf4f526b9d3cc97379ecf86c92bc349e` |
| `SpotItScene.ts` | 15447 | `02a7b4f2f72d1f6ef6b3266b85bd3d6c9fef14cc1f8b3fb9e640733e0693d8fe` |
| `StarFarmScene.ts` | 79551 | `49547d6fd590b2e4b95a058214642cfe05d6e2e677a2e90ca562c1e402c9e5a9` |
| `StoryAdventureScene.ts` | 14700 | `e76a094f5d56b833f408bc2b92ccdea5440bba775435380be55f2c5bd9f9dc05` |
| `TowerDefenseScene.ts` | 24417 | `ff4b46e6e3ca5a24449b4b0f96f363878047afbe9bcb18f6834c140089829dcf` |
| `TrainingAcademyScene.ts` | 7688 | `bc6c7a85acc6ff4360842314ddbb726f5647a6a295e8caff1172a2516937cc28` |
| `TreasureHuntScene.ts` | 12689 | `d8f910035d7fb358916683ef58b6c711cc99baf6888bbf02f6427aa6518cc28a` |
| `TypeAnswerScene.ts` | 12681 | `f7bb24de0c6262a6e5b33ff1e24995d555effab584f5cd281916a596f1e60e28` |
| `WhackAMoleScene.ts` | 10821 | `35268de6d926d183e14d5a07086be5f7613ba27cdef5bf7cc3941d4d66a694c2` |
| `WordsearchScene.ts` | 11309 | `8d85784a13b8f00162d0615ee0f4396b4350daa7dd2c70e83a6e75742a8ab6cb` |

## Evidence-Only Parent-Engine Mapping

This is a review map, not a declaration that every source scene is a current
LivingTextbook mode. `Candidate` means that the scene may be useful after a
wrapper review. `Unregistered` means the current canonical catalog has no
approved mode contract for it. The four parent engines remain platform-owned.

| Frozen scene | Candidate mode | Review family | Candidate parent engine | Current status |
| --- | --- | --- | --- | --- |
| Airplane | `airplane` | arcade/action | Selection | Unregistered candidate |
| Anagram | `anagram` | text/spelling | Text/Spelling | Unregistered candidate |
| Balloon Pop | `balloon-pop` | arcade/action | Selection | First arcade review candidate |
| Bridge Builder | `bridge-builder` | syntax/logic | Text/Spelling | Unregistered candidate |
| Crossword | `crossword` | word puzzle | Text/Spelling | Unregistered candidate |
| Endless Runner | `endless-runner` | arcade/action | Selection | Unregistered candidate |
| Farm Life | `farm-life` | world-building | Narrative | Unregistered candidate |
| Flash Cards | `flashcards` | vocabulary/matching | Selection | Compare only; no direct import |
| Gameshow | `gameshow` | quiz/assessment | Selection | Unregistered candidate |
| Group Sort | `group-sort` | memory/sorting | Pairing | Unregistered candidate |
| Label It | `label-it` | vocabulary/matching | Pairing | Later multimedia candidate |
| Match Up | `match-up` | vocabulary/matching | Pairing | Compare only; no direct import |
| Maze Chase | `maze-chase` | arcade/action | Selection | Unregistered candidate |
| Memory Match | `memory-match` | memory/sorting | Pairing | First bounded wrapper candidate |
| Monster Fighter | `monster-fighter` | arcade/action | Selection | Unregistered candidate |
| Physics Puzzler | `physics-puzzler` | arcade/action | Selection | Unregistered candidate |
| Quiz | `quiz` | quiz/assessment | Selection | Unregistered candidate |
| Rescue Quest | `rescue-quest` | narrative/action | Narrative | Unregistered candidate |
| Rhythm Tap | `rhythm-tap` | arcade/action | Selection | Unregistered candidate |
| Snaking | `snaking` | arcade/action | Selection | Unregistered candidate |
| Space Explorer | `space-explorer` | arcade/action | Selection | Unregistered candidate |
| Speak It | `speak-it` | speaking/listening | Selection | Voice/privacy review required |
| Spin Wheel | `spin-wheel` | reward/utility | Selection | Reward policy conflict; blocked |
| Spot It | `spot-it` | memory/sorting | Pairing | Unregistered candidate |
| Star Farm | `star-farm` | world-building | Narrative | Unregistered candidate |
| Story Adventure | `story-adventure` | narrative | Narrative | Unregistered candidate |
| Tower Defense | `tower-defense` | arcade/action | Selection | Unregistered candidate |
| Training Academy | `training-academy` | recovery/review | Narrative | Compare to platform recovery lane |
| Treasure Hunt | `treasure-hunt` | narrative/action | Narrative | Pirate-theme and reward review required |
| Type Answer | `type-answer` | spelling/typing | Text/Spelling | Unregistered candidate |
| Whack-a-Mole | `whack-a-mole` | arcade/action | Selection | Unregistered candidate |
| Word Search | `wordsearch` | word puzzle | Text/Spelling | Unregistered candidate |

The scene count, catalog count, and summary count must not be silently merged:
the frozen snapshot contains 32 active scene files, while its summary text
claims 25 games and its catalog documentation is internally inconsistent.
Any future integration proposal must identify the exact source files and
canonical mode contract it is based on.

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

**Current precedence:** the earlier Balloon Pop-first ordering in this
historical inventory is superseded by DR-707 and DR-790. The active order is:

1. **Memory Match:** first Phaser wrapper candidate. It maps directly to the
   early learner pathway and tests whether the Phaser presentation can preserve
   the existing pairing semantics, audio-first behavior, deterministic replay,
   and completion reporting.
2. **Balloon Pop:** second candidate. It exercises motion, collision/input,
   short vocabulary prompts, timing, and escape/miss semantics after the basic
   wrapper pattern is proven.
3. **Label It:** third candidate. It tests teacher image assets, label anchors,
   rights, and compatibility with the upload/evidence foundations.
4. **Speak It or Rescue Quest:** later voice candidate, gated by microphone and
   premium-cost policy.

## Current Decision

The suite is accepted as a rich prototype inventory, not as a production
engine. The first integration proposal must wrap one candidate around a
LivingTextbook parent-engine contract and remove direct authority over schema,
scoring, mastery, rewards, persistence, routes, and assignments.

## Review Guardrails

- This manifest does not copy, execute, bundle, or route the frozen source.
- `No direct source import`.
- `No route replacement`.
- `No scene-owned scoring`.
- `No browser persistence ownership`.
- `No package promotion`.
- `No student assignment`.
- A candidate remains blocked until payload, event, audio, deterministic replay,
  accessibility, identity, persistence, and tenant-policy evidence are complete.
- `BaseEngine` remains a review finding, not a permitted platform boundary.
- Phaser may provide presentation, motion, and interaction handling; the
  LivingTextbook runtime owns validation, score, mastery, rewards, persistence,
  reporting, and assignment authority.
- Any count or mode mismatch discovered during later review must update this
  evidence artifact and the decision register before candidate approval.
