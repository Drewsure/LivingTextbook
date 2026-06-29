# Training Academy Contract

Document type: foundation route, event, and product contract

Status: Planned contract; no active Training Academy route yet

Related standards:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/DECISION_REGISTER.md`
- `docs/ROUTE_CONTRACTS.md`
- `docs/GAME_ENGINE_CONTRACTS.md`
- `docs/BUILD_SESSIONS.md`

## Purpose

Training Academy is the recovery and practice lane for students who need more time before mastery.

It must feel like guided practice, not failure. It should help students bridge gaps in vocabulary, syntax, audio comprehension, or game mechanics, then return them to the normal unit progression path.

## Product Rule

Training Academy is part of the core Living Textbook platform. It is not an AI Tutor feature and must work without AI Tutor enabled.

AI Tutor may later provide premium explanations or guided review for upper-level students, but the baseline Training Academy must remain available through deterministic game and practice modes.

## Entry Triggers

Training Academy may be recommended when:

- Unit score is below the mastery threshold.
- A module score is below the 75% threshold.
- A student misses repeated vocabulary terms.
- A student misses repeated syntax patterns.
- A teacher assigns extra practice.
- A student chooses practice from the unit summary.
- A game mode reports repeated incorrect attempts.

## Route Shape

Planned route forms:

- `/training/[launchCode]`
- `/training/[launchCode]/unit/[unitKey]`
- `/training/[launchCode]/mode/[gameMode]`

Routes must preserve:

- Tenant id.
- Launch code.
- Unit key.
- Student session id or safe anonymous practice id.
- Practice focus.
- Return path to the normal unit progression route.

## Practice Focus Types

Initial focus values:

- `vocabulary-review`
- `sentence-review`
- `audio-listening`
- `spelling-review`
- `mode-practice`
- `mixed-recovery`

## Recommended Game Modes

Training Academy should reuse existing parent engines and mode configs.

Examples:

- Vocabulary review: flashcards, memory match, word match.
- Sentence review: sentence builder, fill in the blank, ordering.
- Audio listening: speakable text, dictation, audio-assisted flashcards.
- Spelling review: spelling practice, type answer.
- Mode practice: simplified version of the same game mode that caused difficulty.

Do not build separate Training Academy games when a parent engine config can serve the same purpose.

## Scoring And Rewards

Training Academy can award Star Dust, but it must not become an exploit path.

Rules:

- Practice rewards should be smaller than primary unit-game rewards.
- Practice rewards should target the gap that triggered review.
- Practice can help students reach mastery thresholds when they narrowly miss.
- Practice should not let students bypass required unit completion.
- Rewards should be transparent and mastery-based.

Recommended scoring:

- Vocabulary recovery: up to 150 Star Dust per review session.
- Syntax recovery: up to 150 Star Dust per review session.
- Listening or spelling recovery: up to 100 Star Dust per review session.
- Teacher-assigned practice may be completion-only or low-dust.

These are planning values, not final economy constants.

## Event Contract

Training Academy should emit standard events before database persistence is introduced.

Required events:

- `training_recommended`
- `training_started`
- `training_item_shown`
- `training_answer_submitted`
- `training_answer_result`
- `training_completed`
- `training_returned_to_unit`

Until the shared event model is expanded, connector-side prototypes may represent these through existing local events plus metadata. Before production persistence, dedicated event types should be added to the shared content model.

Recommended metadata:

- `focusType`
- `sourceGameMode`
- `recommendedGameMode`
- `targetTerm`
- `targetSentenceIndex`
- `attemptCount`
- `earnedStarDust`
- `returnPath`
- `teacherAssigned`

## Teacher Visibility

Teacher reports should show:

- Why Training Academy was recommended.
- Which focus area was practiced.
- Whether the student completed the practice.
- Whether mastery improved afterward.
- Whether the student returned to normal unit progression.

Teacher reports should not shame the student. Language should be recovery-oriented.

## Audio Requirements

Training Academy must follow the audio-first standard.

- Every learner-facing term must be listenable.
- Every target sentence must be listenable.
- Every instruction and feedback prompt must have audio support.
- Listening practice must keep comprehension audio separate from optional background music.

## AI Tutor Boundary

AI Tutor is not required for Training Academy.

Future premium AI Tutor may add:

- Short mistake explanations.
- Upper-level writing hints.
- Role-play recovery.
- Teacher-visible tutor summaries.

But the baseline Training Academy must use deterministic content, reviewed payloads, reusable games, audio cues, and standard progress events.

## First Prototype Acceptance

A first Training Academy prototype should demonstrate:

1. A student misses or is flagged for a small vocabulary gap.
2. A `training_recommended` event is emitted.
3. A review activity opens using an existing parent engine or flashcard practice shell.
4. Learner-facing text is audio-supported.
5. A completion event is emitted.
6. Small recovery Star Dust is awarded.
7. The student returns to the unit progression route.
8. Teacher-visible summary updates.
9. No AI Tutor requirement.
10. No database/auth requirement until local behavior is verified.

## Current Build Instruction

Do not start Training Academy UI until the current foundation slice is locally verified.

Before implementation:

1. Sync local checkout to `legacy-source-import`.
2. Run typecheck/build.
3. Verify `/launch/demo-unit-1` and `/enter/ministar`.
4. Confirm media telemetry and AI Tutor entitlement checks.
5. Then add the smallest Training Academy local-state prototype.
