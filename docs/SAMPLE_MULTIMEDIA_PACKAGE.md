# Sample Multimedia Content Package

This document explains the first sample Living Textbook multimedia package implemented in the web app.

Canonical sample file:

- `apps/web/src/data/sampleMultimediaPackage.ts`

Visible concept panels:

- `apps/web/src/features/multimedia/MultimediaPackagePanel.tsx`
- `apps/web/src/features/multimedia/UnitMediaEngagementPanel.tsx`
- `apps/web/src/features/multimedia/UnitMediaPlaybackCard.tsx`
- `apps/web/src/features/access/FrontDoorEntryFlow.tsx`
- `apps/web/src/features/access/FrontDoorTeacherReportPreview.tsx`
- `apps/web/src/features/teacher/TeacherProgressSummaryConcept.tsx`
- `apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx`

Active sample routes:

- `/`
- `/launch/demo-unit-1`
- `/enter/ministar`

## Purpose

The sample proves that a Living Textbook unit can include more than a vocabulary/game payload.

The unit package includes:

- 1 Level 1 greetings unit
- flashcard entry practice
- playable Memory Match as the next unlocked game
- 8 vocabulary audio cues
- 2 target sentence audio cues
- instruction and feedback audio cues
- 1 audio asset
- 1 video asset
- 1 playlist
- 1 optional game-background media setting
- 1 permanent QR route concept
- 1 front-door entry-code/user-code access policy
- 1 teacher-visible progress summary concept

## Important Boundaries

This is sample data, not a hard-coded product rule.

The sample should guide implementation without making MiniStar the only supported tenant.

## Route Concept

The sample demonstrates three entry ideas:

- Short classroom route: `/launch/demo-unit-1`
- Permanent textbook QR route: generated from stable tenant/series/book/unit/activity identifiers
- Front-door route: `/enter/ministar`, where an entry code and optional user code can connect progress to teacher reports

Sample front-door codes:

- Entry code: `HELLO-101`
- User code: `STUDENT-04`

## Front-Door Interaction

The sample front-door route lets a student:

1. Open `/enter/ministar`.
2. Submit the sample entry and user codes.
3. Open the reviewed unit package.
4. Complete flashcard entry practice.
5. Unlock, start, and complete Memory Match.
6. Play or manually start/complete sample media assets through the playback shell.
7. Enable or disable optional background media after Memory Match starts.
8. See the teacher-visible report preview update from the same local event stream.

## Audio Support Concept

Audio support for learner-facing text is mandatory, not decorative.

The sample includes cue-level audio support for:

- every vocabulary term,
- both target sentences,
- flashcard instructions,
- Memory Match instructions,
- and basic success/retry feedback.

The current sample uses text-to-speech cue records as a cost-efficient development fallback. Future tenant builds may replace those cues with recorded files, teacher-recorded audio, partner-owned audio, or local/offline bundled audio without changing the game payload contract.

Audio cues are separate from the chant/music asset. The chant can enrich the unit or run as optional background media. The audio cues are the comprehension layer that lets a child hear the words and instructions they need to complete the activity.

## Memory Match Concept

The current Memory Match slice uses the reusable pairing parent-engine state.

It supports:

- hidden cards,
- tap-to-hear card selection,
- pair matching,
- attempt counts,
- completion state,
- additional Star Dust on completion through the shared scoring profile,
- item-level `round_shown`, `answer_submitted`, `answer_result`, and `mastery_updated` events,
- and standard `game_started` / `game_completed` events.

This is still a structural implementation, not premium game polish. Art, animation, richer feedback, and mascot/collection celebration should come after local build verification.

## Multimedia Concept

The sample includes an audio chant and lesson video as package assets. It also includes a multimedia plan where the chant may be used as optional background/support media for Memory Match.

`UnitMediaPlaybackCard` renders native browser audio/video controls for package media assets when `sourceUri` or `localBundlePath` is available. Manual start/complete controls remain available so the reporting contract can be tested even when demo media files are not yet present in the local bundle.

Background media is off by default and requires teacher enablement.

## Teacher Reporting Concept

The sample teacher report separates:

- launch opened
- flashcard completion
- Memory Match starts/completions
- Memory Match card reveals, answer submissions, answer results, and mastery updates
- audio cue engagement for learner-facing text, when implemented as telemetry
- media starts/completions
- optional background media use
- average Star Dust

This separation is intentional. Media engagement should support learning, but it should not be merged into language mastery as an opaque score.