# Living Textbook Game Engine Contracts

This document defines the contract for every game mode that enters the canonical Living Textbook platform.

It applies to:

- new in-repo game work,
- promoted legacy game code,
- Z.ai or outside-agent prototypes,
- public-repository inspired implementations,
- future premium game skins and animations.

The goal is not to build 48 isolated games. The goal is to build reusable parent engines that can render many modes from tenant-aware, curriculum-aware payloads.

## Hard Gate

No game mode may enter `apps/web` as production-facing code until it satisfies this contract or has a documented exception.

Required before promotion:

- Parent engine identified.
- Mode config written.
- Input payload shape documented.
- Standard progress events emitted.
- Star Dust or tenant reward scoring mapped.
- Learner-facing audio support implemented.
- Mobile layout checked.
- Tenant branding respected.
- Optional multimedia behavior separated from comprehension audio.
- Legacy, Z.ai, or public-source provenance recorded when applicable.

## Parent Engines

The platform uses four technical parent engines.

| Parent engine | Core job | Example modes |
| --- | --- | --- |
| `pairing` | Match source and target items, validate pairs, track attempts and completion. | Flashcards, Word Match, Match Up, Matching Pairs, Memory Match, Balloon Pop, Whack-a-Mole as pairing variants. |
| `selection` | Present choices, capture decisions, validate correct/incorrect answers, handle timers or movement. | Quiz, True or False, Gameshow Quiz, Airplane, Maze Chase, Physics Puzzler, Bridge Builder. |
| `text-spelling` | Build, order, type, spell, and validate text strings or word arrays. | Spelling, Type Answer, Typing Race, Anagram, Sentence Builder, Fill in the Blank, Word Search, Crossword. |
| `narrative` | Track story state, dialogue choices, branching missions, and multi-step completion. | Story Bridge, Mystery Detective, Rescue Quest, Boss Battle dialogue variants. |

A mode may have arcade presentation, but its learning logic must still map to one parent engine.

## Mode Config Contract

Each game mode should be described by a mode config before the screen is built.

Minimum config fields:

```ts
interface GameModeConfig {
  modeId: GameModeId;
  label: string;
  family: GameFamily;
  parentEngine: ParentEngine;
  skillFocus: "vocabulary" | "syntax" | "listening" | "speaking" | "review" | "mixed";
  supportedLevels: number[];
  recommendedTermRange: { min: number; max: number };
  requiredSentenceCount: 2;
  scoringProfileId: string;
  audioRequirement: "required";
  allowsBackgroundMedia: boolean;
}
```

Mode configs should live near `apps/web/src/features/game-shell/gameModeCatalog.ts` until a larger registry is needed.

Current catalog status:

- `flashcards`: active entry-practice config.
- `memory-match`: active playable pairing config.
- `quiz`: planned selection assessment config only.
- `sentence-builder`: planned text/syntax config only.
- `speak-it`: planned speaking/listening config only.
- `balloon-pop`: planned arcade reinforcement config only.

Config-only modes are not playable implementations and must not be presented as finished games.

## Input Payload Contract

Every game receives reviewed content. It does not generate curriculum on its own.

Minimum game input:

- `UnitPayload`
- `LaunchSession`
- `StudentProgressionState`
- `GameModeId`
- optional `AudioCue[]`
- optional multimedia plan or background media context
- callback for standard progress/completion events

Rules:

- Use `pedagogicalPayload.vocabularyTerms` for term prompts.
- Use `pedagogicalPayload.targetSentences` for sentence or syntax prompts.
- Do not assume more than 8 terms by default.
- Support 8-12 terms unless a mode config explicitly narrows the range.
- Do not hard-code MiniStar visual rules into the engine.
- Use tenant configuration and mode config for labels, rewards, and styling.

## Output Event Contract

Every game mode must report standard events through the platform event model.

Required events for a playable mode:

- `game_started`
- `round_shown` or equivalent item/prompt shown event when the mode has rounds
- `answer_submitted` when the learner acts on an answerable prompt
- `answer_result` for correct/incorrect or matched/mismatched outcomes
- `game_completed`
- `mastery_updated` when mastery state changes

Optional events:

- `powerup_used`
- `training_recommended`
- `media_started`
- `media_paused`
- `media_completed`
- `background_media_enabled`
- `background_media_disabled`

Every event should include:

- `unitKey`
- `gameMode`
- `launchCode` when launched from a session
- `studentSessionId` when available
- `occurredAt`
- useful metadata such as attempts, correct count, term id, earned reward amount, media asset id, or parent engine id

## Scoring Contract

Game scoring must map to the Star Dust model or a tenant-renamed equivalent.

Canonical unit target:

- Vocabulary: up to 300
- Syntax: up to 300
- Accuracy/reflex/mode bonus: up to 400
- Total: 1,000 per unit

Rules:

- Vocabulary scoring scales to actual term count.
- Sentence/syntax scoring assumes exactly 2 target structures.
- A game may award a slice of the unit total rather than the whole unit total.
- Completion rewards must be deterministic and explainable.
- Random rewards must be bonus cosmetics only and must not replace mastery-linked rewards.

## Scoring Profile Layer

Game modes should not hard-code reward math inside presentation components.

Current code location:

- `apps/web/src/features/game-shell/scoringProfiles.ts`

Current profiles:

- `entry-vocabulary-practice`: awards the vocabulary slice for required flashcard entry practice.
- `pairing-reinforcement-v1`: awards an accuracy-sensitive completion bonus for pairing reinforcement games such as Memory Match.
- `selection-assessment-v1`: planned profile for quiz-style selection assessment.
- `syntax-construction-v1`: planned profile for sentence building, ordering, and fill-in modes.
- `speaking-listening-practice-v1`: planned profile for audio-led speaking/listening practice without AI Tutor.
- `arcade-reinforcement-v1`: planned profile for reflex-based vocabulary reinforcement.

Rules:

- Mode configs reference `scoringProfileId`.
- Components may request a scoring profile and call shared scoring helpers.
- Scoring events should include `scoringProfileId` metadata when possible.
- Tenant reward names may change, but scoring profile behavior must remain explainable to teachers and parents.
- Future profile changes should be versioned rather than silently changing historical meaning.
- Planned profiles do not make a mode playable; they only reserve the scoring contract.

## Audio Contract

Learner-facing audio is mandatory.

A playable game must support listen/replay for:

- vocabulary terms,
- target sentences,
- instructions,
- feedback,
- important prompts,
- critical controls.

Preferred behavior:

- Tap/click learner-facing text itself to speak.
- Use a separate listen control when the text is also an action or when text-as-control would be confusing.
- Avoid autoplay unless the mode explicitly requires it and the teacher/tenant can control it.

Implementation rules:

- Use shared audio components and helpers from `apps/web/src/features/audio`.
- Accept `AudioCue[]` and resolve cue text/language where available.
- Fall back to reviewed text-to-speech during early development.
- Do not tie comprehension audio to optional background media.
- Future recorded, teacher-recorded, partner-provided, or offline audio must be replaceable without rewriting game logic.

## Multimedia Contract

Unit media may support a game, but a game must remain playable without background media.

Allowed integrations:

- optional background song or chant,
- prompt audio or video before/after a round,
- celebration media after completion,
- teacher-enabled media support during a game.

Rules:

- Background media must be optional and disable-able.
- Media events report separately from game mastery.
- Media assets must carry rights and owner metadata before production use.
- Games should consume a multimedia plan, not query media catalogs directly.

## UI And Component Contract

Game screens must be composed from clear layers.

Recommended split:

- Parent engine state: pure or mostly pure state helpers.
- Engine adapter: maps `UnitPayload` into engine items.
- Mode component: renders the specific game surface.
- Progress adapter: emits standard events and scoring results.
- Audio layer: shared audio components/helpers.

Rules:

- Do not mix AI generation, scoring, media playback, tenant branding, and game state into one large screen.
- Use stable dimensions for boards, cards, counters, and controls.
- Build mobile-first for classroom QR use.
- Keep premium animation and art outside the core correctness engine.
- Use tenant CSS variables and shared primitives where possible.

## Legacy Promotion Gate

Before legacy code becomes canonical game code, record:

- legacy source path,
- target path,
- parent engine mapping,
- dependency changes,
- state refactor needed,
- payload mapping,
- event mapping,
- scoring mapping,
- audio support plan,
- white-label risks,
- verification steps.

Legacy UI may inspire the product, especially `legacy/ministar-game-studio-ai` for early learners, but legacy screens should not be copied into canonical routes as tangled one-off implementations.

## Z.ai And Outside-Agent Task Contract

Any Z.ai or outside-agent game task must include:

- parent engine,
- mode id,
- exact input JSON shape,
- expected output events,
- scoring profile,
- audio requirements,
- mobile layout requirements,
- allowed dependencies,
- forbidden architecture changes,
- asset and license rules,
- acceptance checklist.

Outside-agent output is a candidate, not automatically production code. Codex retains architecture, schema, integration, and final review control.

## Public Repository And Asset Contract

Public repositories and assets can help, but they must be governed.

Before adoption:

- record source URL,
- record owner and license,
- confirm commercial white-label rights,
- confirm modification and redistribution rights,
- record attribution requirements,
- assess maintenance and security risk,
- write integration plan,
- add rejection reason if not adopted.

See `docs/RESEARCH_NOTES_PUBLIC_REPOS.md` and `docs/DECISION_REGISTER.md` DR-010.

## First Accepted Example

Current first playable example:

- Mode: `memory-match`
- Parent engine: `pairing`
- Adapter: `pairingEngineAdapter.ts`
- State: `pairingEngineState.ts`
- Scoring profile: `pairing-reinforcement-v1`
- Component: `PairingMemoryMatchGame.tsx`
- Input: `UnitPayload`, `LaunchSession`, `StudentProgressionState`, optional `AudioCue[]`
- Events: `game_started` from the route; `round_shown`, `answer_submitted`, `answer_result`, and `mastery_updated` from the game; `game_completed` from the completion helper
- Current known gap: events are local-state only and are not persisted to a backend yet.

This example is acceptable as the first structural playable slice. Future production-ready games can add richer item identifiers, analytics metadata, and persistence without changing the parent-engine contract.

## Acceptance Checklist

A game mode is ready for review when:

- It consumes a reviewed payload.
- It maps to a parent engine.
- It uses a mode config.
- It uses a scoring profile.
- It renders on mobile without overlap.
- It supports audio for learner-facing text and critical controls.
- It emits standard events.
- It updates progression and rewards through shared adapters.
- It remains tenant-configurable.
- It works without optional background media.
- It has local verification steps in `docs/VERIFICATION_CHECKLIST.md`.
- Any legacy, public, or outside-agent source is documented.
