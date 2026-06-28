# ADR-0006: Audio-First Learner Support

Status: Accepted

Date: 2026-06-28

## Context

The Living Textbook platform serves young learners and English language learners. Many students cannot be assumed to read independently, especially in early levels, QR-launched classroom practice, partner textbook companions, and self-progression flows.

The platform already treats audio, video, playlists, and optional background media as core multimedia package primitives. That is necessary but not sufficient. A unit can include an audio file and still fail the learner if vocabulary terms, target sentences, prompts, instructions, feedback, and critical controls are text-only.

## Decision

All student-facing learning flows must be audio-first.

Every unit must define an audio support plan for learner-facing text. At minimum, the plan must cover:

- vocabulary terms,
- target sentences,
- student-facing game instructions,
- important feedback,
- and critical controls or prompts required to complete the activity.

The preferred default interaction is tap/click-to-speak: the child taps the learner-facing text itself to hear it. Separate listen buttons remain acceptable when text-as-control would be unclear, crowded, or inaccessible.

Autoplay is allowed only as a controlled opt-in behavior for specific cases such as first-card reveal, listening drills, accessibility settings, or teacher-led presentation mode. Autoplay must be disable-able, must not overlap competing audio, and must respect classroom noise, browser permission, and accessibility constraints.

Every parent game engine must accept audio cue references in its mode payload. Audio cues may resolve to recorded files, partner-provided audio, teacher-recorded audio, generated text-to-speech, or reviewed placeholders during early development.

Optional background music is separate from comprehension audio. Background media can be disabled for accessibility, classroom noise, or bandwidth reasons. Comprehension audio for learner-facing text cannot be silently omitted from a student-ready unit.

## Consequences

Positive consequences:

- Early learners and non-fluent English readers can use the platform without being blocked by text.
- The platform becomes stronger for white-label textbook partners because audio can be attached to every visible learning item, not only to separate music/video pages.
- Text-to-speech can provide a cost-efficient fallback while recorded tenant audio, teacher audio, or partner audio is developed.
- Game engines become more reusable because audio support is a standard payload capability rather than a per-game add-on.
- Tap-to-speak keeps audio under learner control and avoids noisy accidental playback in classrooms.

Tradeoffs:

- Content packages require more metadata.
- Game components must render text as accessible audio controls or provide equivalent listen/replay controls.
- Verification must check audio cue coverage before student assignment.
- Autoplay settings require careful product control because they can cause overlapping audio, browser restrictions, or classroom noise issues.
- Real audio playback and offline bundling still need implementation after the contract is proven.

## Implementation Notes

The initial implementation adds:

- `AudioCue` and `UnitAudioSupportPlan` to `packages/content-model/src/index.ts`.
- Content package validation requiring each unit to include an audio support plan.
- Sample Unit 1 audio cues for 8 vocabulary terms, 2 target sentences, basic instructions, and feedback.
- Dashboard visibility for audio cue counts and support-plan status.
- `AudioCueText`, a reusable text-as-audio control using browser speech synthesis as the first cost-efficient fallback.
- Flashcard terms and target sentences that speak when the learner taps the text itself.

Future implementation should add:

- shared listen/replay UI primitives for game prompts, instructions, feedback, and controls,
- text-to-speech provider abstraction,
- recorded audio asset upload/linking,
- offline/local bundle resolution,
- controlled autoplay settings for appropriate modes,
- audio event telemetry when useful,
- teacher review surfaces for missing or low-quality audio,
- and game-engine payload mapping for cue-level playback.

## Related Documents

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/DECISION_REGISTER.md` DR-009
- `docs/ROUTE_CONTRACTS.md`
- `docs/VERIFICATION_CHECKLIST.md`
- `docs/adr/0005-core-multimedia-package.md`
