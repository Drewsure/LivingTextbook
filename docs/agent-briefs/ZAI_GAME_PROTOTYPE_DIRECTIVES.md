# Z.ai Game Prototype Directives

Document type: outside-agent task brief

Status: Active directive template for work in `Drewsure/ministar-lab` only

## Authority

Codex owns architecture, schema discipline, integration, and final review for `Drewsure/LivingTextbook`.

Z.ai may prototype isolated game modes in `Drewsure/ministar-lab` only. Z.ai output is candidate code, not production code. No Z.ai output may be copied into `apps/web`, `apps/ai-service`, or shared packages without a written integration plan and Codex review.

## Engine Surface Rule

Phaser is valuable and should be used where motion is central to the learning experience.

Use Phaser first for:

- Balloon Pop,
- Whack-a-Mole,
- Maze Chase,
- Airplane,
- Endless Runner,
- Physics Puzzler,
- Bridge Builder,
- other action, timing, collision, physics, or reflex modes.

Use DOM/React-style reference prototypes first for:

- Sentence Builder,
- Fill in the Blank,
- Type Answer,
- Spelling,
- Quiz / True-False,
- teacher-report-heavy or text-heavy modes.

Reason: text-heavy games need accessible text, tap-to-speak controls, localization, keyboard/focus behavior, clean event output, and deterministic scoring before premium animation. Phaser may still become a later skin for a text mode, but it is not the first integration surface unless motion is the actual mechanic.

A Phaser prototype can be visually stronger and still be architecturally unready until it emits LivingTextbook events. A DOM reference prototype can be visually plain and still be the correct first build if it proves schema, audio, scoring, and reporting.

## Current Priority Order

1. Sentence Builder DOM/reference prototype.
2. Fill in the Blank DOM/reference prototype.
3. Quiz / True-False DOM/reference prototype.
4. Phaser wrapper review for existing Balloon Pop or Whack-a-Mole prototype work.

Do not promote Phaser prototypes into LivingTextbook until the parent-engine event wrapper, audio behavior, mobile controls, scoring, and white-label boundaries are reviewed.

## Global Constraints

Every prototype must:

- Accept JSON-style input.
- Support 8-12 vocabulary terms.
- Require exactly 2 target sentence structures.
- Include audio support for every learner-facing word, sentence, instruction, feedback item, and critical control.
- Be mobile-first and classroom QR friendly.
- Emit standard events.
- Keep game logic separate from UI styling.
- Use deterministic scoring hooks.
- Avoid hard-coded MiniStar-only assumptions.
- Avoid auth, database, billing, or repository-architecture changes.
- Avoid importing public code/assets without license and provenance notes.
- Include a README explaining payload shape, event output, scoring assumptions, audio behavior, and limitations.

## Required Event Shape

Prototype event output should map to the Living Textbook event model:

```json
{
  "type": "answer_result",
  "unitKey": "tenant:curriculum:L1:U1",
  "gameMode": "sentence-builder",
  "occurredAt": "2026-06-29T00:00:00.000Z",
  "metadata": {
    "correct": true,
    "attemptCount": 1,
    "scoringProfileId": "syntax-construction-v1"
  }
}
```

Required events for playable prototypes:

- `game_started`
- `round_shown`
- `answer_submitted`
- `answer_result`
- `mastery_updated`
- `game_completed`

## Sentence Builder Prompt For Z.ai

Build an isolated Sentence Builder prototype in `Drewsure/ministar-lab` only.

Use this target:

- Parent engine: `text-spelling`
- Mode id: `sentence-builder`
- Recommended surface: DOM/React-style reference prototype first, Phaser skin later only if approved
- Scoring profile: `syntax-construction-v1`
- Target learners: Level 2+ initially
- Input: 8 vocabulary terms and exactly 2 target sentence patterns
- Output: standard events listed above

Prototype behavior:

1. Load a JSON payload with `unitMeta`, `pedagogicalPayload.vocabularyTerms`, and `pedagogicalPayload.targetSentences`.
2. Show one sentence-building challenge at a time.
3. Break a target sentence into draggable or tappable word tokens.
4. Let the student arrange tokens into the correct sentence.
5. Provide tap-to-hear support for every token and full target sentence.
6. Provide a separate listen/replay control for submit and other critical controls.
7. Emit `round_shown` when a sentence challenge appears.
8. Emit `answer_submitted` when the student checks their sentence.
9. Emit `answer_result` with correctness and attempt count.
10. Emit `mastery_updated` when both target sentences are successfully built.
11. Emit `game_completed` with `scoringProfileId: "syntax-construction-v1"`.

Do not add auth, database, global routing, AI tutor, payment, or new app architecture.

## Fill In The Blank Prompt For Z.ai

Build an isolated Fill in the Blank prototype in `Drewsure/ministar-lab` only.

Use this target:

- Parent engine: `text-spelling`
- Recommended surface: DOM/React-style reference prototype first
- Mode id: use a local prototype id until LivingTextbook adds the final mode id
- Scoring profile: `syntax-construction-v1`
- Input: 8 vocabulary terms and exactly 2 target sentence structures

Prototype behavior:

1. Show target sentences with one missing vocabulary or grammar slot.
2. Provide 3-4 answer choices per blank.
3. Support tap-to-hear for sentence, choices, instructions, and feedback.
4. Emit standard events.
5. Keep scoring deterministic and explainable.
6. Keep layout stable on mobile.

Do not build custom backend, auth, or tenant logic.

## Quiz / True-False Prompt For Z.ai

Build an isolated Quiz / True-False prototype in `Drewsure/ministar-lab` only.

Use this target:

- Parent engine: `selection`
- Recommended surface: DOM/React-style reference prototype first; animated/game-show skin later
- Mode id: `quiz` or local `true-false` prototype id
- Scoring profile: `selection-assessment-v1`
- Input: 8 vocabulary terms and exactly 2 target sentence structures

Prototype behavior:

1. Render audio-supported quiz prompts.
2. Support vocabulary recognition and sentence understanding.
3. Provide tap-to-hear for prompts, choices, instructions, and feedback.
4. Emit standard events.
5. Keep answer state, scoring, and UI separate.
6. Keep mobile layout stable.

Do not build global architecture, auth, database, billing, or AI tutor.

## Phaser Arcade Prompt Rule

For Balloon Pop, Whack-a-Mole, Maze Chase, Airplane, Endless Runner, Physics Puzzler, or Bridge Builder, Z.ai may use Phaser.

Required Phaser constraints:

1. Keep Phaser scene code isolated from payload parsing, scoring, and event normalization.
2. Accept LivingTextbook-style JSON input.
3. Emit the required standard event list.
4. Provide tap-to-hear or listen/replay controls for prompts, choices, instructions, feedback, and critical controls.
5. Keep background music separate from comprehension audio.
6. Provide pause, replay, and teacher-friendly volume behavior.
7. Include mobile controls and responsive canvas sizing.
8. Include dependency and license notes.

Do not hard-code rewards, global routes, auth, database, AI tutor, or tenant-specific art into Phaser prototypes.

## Deliverable Format

Each Z.ai prototype should include:

- Source files in `Drewsure/ministar-lab` only.
- A README.
- Sample payload JSON.
- Event output examples.
- Known limitations.
- Any dependency/license notes.

## Rejection Conditions

Reject or refactor the output if it:

- Assumes exactly 12 vocabulary terms.
- Lacks learner audio support.
- Hard-codes MiniStar as the only tenant.
- Mixes UI, scoring, data, and game state into one tangled screen.
- Adds auth/database/global routing.
- Imports unclear-license assets.
- Uses Phaser for text-heavy modes without a clear accessibility and reporting plan.
- Uses generic low-fidelity UI that cannot mature into the Living Textbook standard.
- Presents itself as production-ready without integration review.
