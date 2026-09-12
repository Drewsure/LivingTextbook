# Z.ai Phaser Candidate Comparison

**Date:** 2026-09-12  
**Source:** `Drewsure/ministar-lab` frozen snapshot `eb79ddf5940ab47cc3c45c119c67ee1b6b958e55`  
**Review status:** Prototype review only. No production integration approval.

## Decision

Memory Match is the first Phaser candidate for a controlled Living Textbook wrapper. Balloon Pop is the second candidate and the first arcade-style candidate after the wrapper contract is proven.

This is a sequencing decision, not a quality ranking. Balloon Pop has stronger movement and timing potential, while Memory Match has a smaller and more predictable state surface for validating the integration boundary.

## Comparison

| Area | Memory Match | Balloon Pop | Platform decision |
| --- | --- | --- | --- |
| Core loop | Tap two cards, compare pair IDs, show match/mismatch | Pop a balloon, let the word fall, compare landing box | Both can map to a reusable pairing engine |
| Round boundary | Clear pair attempt | Timing sequence with missed, wrong, and correct outcomes | Memory Match first |
| Mobile control | Tap targets resize from available canvas space | Global pointer hit testing and moving targets | Require touch-target and small-screen tests for both |
| Audio | Taps speak card text; instructions use browser TTS | Prompt, definition, and answer feedback use browser TTS | Replace direct audio calls with canonical audio cues |
| Scoring | `BaseEngine.recordAnswer()` increments score | Same shared score mutation plus miss/wrong branches | Platform scorer must own score and mastery |
| Events | Internal EventBus plus xAPI answered/completed | Same, with timing/miss branches | Adapter must emit canonical six-event taxonomy |
| Persistence | Base engine/local storage settings and sticker effects | Same | No student progress may be written by the game |
| Determinism | Card shuffle and entrance animation use randomness | Term, colour, position, and timing use randomness | Inject a platform seed or record a replay seed |
| Accessibility | Cards and labels are speakable; canvas semantics remain limited | Moving targets and canvas-only interaction need extra assist mode | Add keyboard/assist pathway before release |
| Tenant safety | Theme-driven visuals but emoji/content assumptions remain | Balloon emoji and free-form prompt assumptions remain | Tenant configuration must control visual and language rules |

## Required wrapper boundary

The Phaser scene must be treated as a view and interaction adapter. The Living Textbook runtime owns:

1. The validated unit payload and tenant identity.
2. Student/session identity supplied by the launch flow.
3. `game_started`, `round_shown`, `answer_submitted`, `answer_result`, `game_completed`, and `mastery_updated` events.
4. Deterministic score, mastery, retry, and completion decisions.
5. Audio cue resolution, including target language and support-language policy.
6. Earned collection and progression updates.
7. Persistence, reporting, assignment links, and teacher-visible results.

The scene may report interaction facts and render feedback. It must not directly decide the canonical score, write student progress to browser storage, invent a student identity, post telemetry to a fixed endpoint, or award random cosmetics.

## Memory Match acceptance conditions

- Accept the canonical content payload through an adapter, not a MiniStar-specific `TermItem` shape.
- Emit a round event when a pair is shown and an answer submission/result pair for every attempt.
- Preserve attempts separately from correct pairs.
- Move score and mastery calculation outside `BaseEngine.recordAnswer()`.
- Replace `audioBus.speak()` with the platform audio resolver and manifest language.
- Remove direct local-storage ownership from the integration path.
- Provide an accessible non-canvas fallback or equivalent keyboard/touch assist path.
- Use a supplied seed for card ordering and record it in the session evidence.
- Verify no random sticker, spin-wheel, or reward side effect occurs in the student session.

## Balloon Pop acceptance conditions

- Define whether a balloon that escapes is neutral, an attempt, or a timed miss in the canonical activity contract.
- Define whether a word that misses every definition box is an answer result or a retry prompt.
- Supply a deterministic seed for term selection, colour, spawn position, and movement schedule.
- Make target boxes and moving balloons usable with touch, keyboard, slow mode, and reduced-motion settings.
- Replace free-form English prompts with localized, reviewed content and audio cues.
- Keep the physics/timing presentation inside the scene while the platform owns scoring and mastery.
- Verify that a rapid tap cannot submit multiple answers for one balloon.
- Add an end-to-end replay fixture for correct, wrong, missed, and escaped states.

## Findings that block direct import

- The shared `BaseEngine` mutates score and streak, emits only internal events plus xAPI `answered`/`completed`, and pushes telemetry directly to `/api/telemetry/verify`.
- Actor identity is created or read from `localStorage`; this conflicts with the platform launch/session identity boundary.
- Browser speech synthesis selects an English voice by default and is not driven by a tenant audio manifest.
- Sticker and Star Dust-adjacent effects are attached to the engine and use local storage; these must route through the platform reward runtime.
- Random ordering and animation are not currently represented as replayable session evidence.
- The source contains a broad MiniStar-specific visual and mascot layer, so white-label rules cannot be assumed from the frozen implementation.

## Next controlled work

1. Keep the canonical DOM Memory Match and Balloon Pop slices as reference adapter contracts.
2. Map the frozen Phaser Memory Match and Balloon Pop scene facts to those contracts without importing the scenes into `apps/web`.
3. Run deterministic replay and mobile/touch checks against the reference contracts.
4. Compare Phaser motion, accessibility, audio, and persistence behavior against the verified canonical slices.
5. Issue a Phaser integration recommendation only after both candidate packets pass review.

Until those checks pass, the frozen snapshot remains preserved and the direct source import into `apps/web` or `apps/ai-service` remains blocked.
