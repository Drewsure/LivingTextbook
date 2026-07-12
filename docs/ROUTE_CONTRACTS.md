# Teacher QR Launch And Student Progression Route Contracts

This document defines the clean route and state contracts for the first Living Textbook vertical slice. It is intentionally structural. Visual polish, premium mascot work, animation, and collection-room art come later.

## Goals

- Preserve teacher-led QR onboarding from day one.
- Preserve student self-progression from day one.
- Keep route behavior tenant-aware and curriculum-aware.
- Keep launch state separate from visual presentation.
- Give future auth, database, and classroom-monitoring work a stable contract.
- Support permanent printed QR identifiers for textbook companion products.
- Support front-door entry-code/user-code flows when controlled access or teacher reporting is required.
- Support multimedia routes and events as part of the unit package.
- Support audio cues for learner-facing vocabulary, sentences, instructions, feedback, and critical controls.

## Route Map

| Route | Audience | Status | Purpose |
| --- | --- | --- | --- |
| `/` | Platform / teacher | Active scaffold | Tenant overview, current unit, progression summary, multimedia package concept, audio support concept, and first sequence preview. |
| `/teacher` | Teacher | Active scaffold | Teacher Launch Protocol and student launch path. |
| `/launch/[code]` | Student | Active interactive slice | Short classroom QR entry route. Student starts with flashcards, unlocks Memory Match, and can complete the first playable pairing game. |
| `/enter/[tenantId]` | Student | Active interactive slice | Tenant-branded front door where students enter an entry code and optional user code before opening the unit package. |
| `/assign/[assignmentId]` | Student | Active scaffold | Tenant-scoped private assignment preview that routes students to the correct launch/front-door path without exposing public sharing or teacher/admin controls. |
| `/q/tenant/[tenantId]/series/[seriesId]/book/[bookId]/unit/[unitId]/activity/[activityId]` | Student / teacher | Future contract | Permanent printed textbook QR route that resolves a stable identifier to the current unit, game, media playlist, front door, or teacher preview. |
| `/media/[playlistId]` | Student / teacher | Future contract | Unit-linked playlist or media activity route resolved from a launch session, permanent QR, or teacher preview. |
| `/teacher/units/[unitKey]` | Teacher | Active scaffold | Unit-specific approval, content review, launch settings, audio support review, media review, route readiness, and class assignment blockers. |
| `/teacher/sessions/[launchCode]` | Teacher | Future | Live classroom monitoring, audio cue engagement, media engagement, completion, Training Academy recommendations. |
| `/student/progress` | Student | Future | Lightweight return route for unlocked games, media, rewards, and mastery status. |
| `/training/[code]` | Student | Future | Remedial or adaptive Training Academy route for targeted review. |

## Permanent QR Contract

Permanent QR routes are different from short classroom launch codes.

Short launch codes are useful for a teacher's live class session. Printed textbook QR codes must survive reprints, app updates, content package revisions, and deployment changes.

Required permanent QR identity fields:

- `tenantId`: white-label tenant or publisher.
- `seriesId`: textbook series.
- `bookId`: book or level.
- `unitId`: textbook unit.
- `activityId`: target activity, game, playlist, front door, or teacher preview.
- `language`: optional language code.
- `edition`: optional printed edition.
- `version`: optional content package version.

Permanent QR rules:

- Printed QR codes must resolve stable identifiers, not local files or temporary development paths.
- Permanent QR routes may resolve into `/launch/[code]`, `/enter/[tenantId]`, a media playlist, a game mode, or a teacher preview depending on the target type.
- A local/closed app may resolve the same identifier from an installed content package.
- A hosted redirect may resolve the same identifier when long-term external permanence is required.
- Hybrid QR is the build standard: stable registry, optional tiny hosted redirect, and local app/content-package fallback.
- Do not promise pure offline printed QR behavior unless the installed app, deep link, content package, and update model are explicit.

## Front-Door Entry Contract

Some tenants need a student to scan a QR code, land on a branded front door, and enter access details before the unit opens.

Supported use cases:

- A printed textbook QR sends the student to a tenant front door.
- A teacher gives a class entry code.
- A student enters an optional user code so progress can be connected to a report.
- The same unit package can launch games, multimedia, audio-supported text, rewards, and Training Academy review.

Front-door rules:

- Entry codes and user codes should not expose private student information.
- A front-door entry can create a launch session with `accessMode` set to `front-door-code`.
- Teacher reports may use user codes or anonymized student-session ids, but the QR itself should remain stable and non-private.
- Young learners should not face a heavy account flow when a simpler code-based route is enough.

Implemented sample behavior:

- `/enter/ministar` shows a tenant front door.
- The sample entry code is `HELLO-101`.
- The sample user code is `STUDENT-04`.
- Opening the unit emits `launch_opened`.
- Completing flashcards emits `entry_practice_completed` and `game_unlocked`.
- Starting Memory Match emits `game_started`.
- Completing Memory Match emits `game_completed` and awards additional Star Dust.
- Media buttons emit media progress events.
- Optional background media emits enabled/disabled events after Memory Match starts.
- The sample package includes audio cues for all vocabulary terms, both target sentences, student instructions, and basic feedback.
- Critical front-door, flashcard, next-game, and media actions use separate listen controls so replaying the action label does not perform the action.
- A reusable unit-session summary shows flashcards, Memory Match, media, background media, events, and reward state from the same local progress stream.
- A teacher-visible report preview summarizes game and media events together.

## Audio Support Contract

Audio support is required for learner-facing text.

A unit package must include an audio support plan that maps learner text to audio cues. Audio cue coverage must include:

- every vocabulary term,
- every target sentence,
- student-facing instructions,
- important feedback,
- and critical prompts or controls required by young learners.

Audio cue rules:

- Audio cues may resolve to recorded files, partner-provided audio, teacher-recorded audio, generated text-to-speech, or reviewed placeholders during early development.
- Audio support belongs to the content package and parent game engine payload, not to one-off screens.
- Audio cue support is separate from optional background music, chants, or videos.
- Background media can be disabled without removing comprehension audio.
- Future teacher reports may track audio engagement separately from game mastery and playlist/media engagement.

## Multimedia Route And Event Contract

Multimedia is part of the unit package.

A unit may include:

- songs,
- chants,
- listening tracks,
- lesson videos,
- music videos,
- animations,
- playlists,
- and optional background/support media for games.

Media event requirements:

- Media started
- Media paused
- Media completed
- Background media enabled
- Background media disabled

Media rules:

- Media engagement must be reportable separately from game mastery.
- Games must remain playable without background media.
- Background media must be optional, controllable, and accessible.
- Partner media must carry rights/owner metadata before production use.

## Launch Session Contract

A launch session is the bridge between teacher action and student QR entry.

Required fields:

- `launchCode`: short route-safe code used in `/launch/[code]`.
- `tenantId`: white-label tenant identifier.
- `curriculumId`: curriculum identifier.
- `unitKey`: stable unit identity.
- `status`: draft, open, locked, expired, or completed.
- `accessMode`: teacher QR, permanent QR, front-door code, teacher preview, or student return.
- `entryMode`: first required mode, usually flashcards for young learners.
- `recommendedNextModes`: modes unlocked after entry practice.
- `openedAt`: timestamp for audit and classroom session handling.
- `expiresAt`: optional timestamp for classroom-safe session expiry.

## Student Progression Contract

Student progression begins at QR entry and advances through mastery events.

Required fields:

- `studentSessionId`: anonymous or authenticated student-session key.
- `launchCode`: launch session that created the flow.
- `unitKey`: unit being played.
- `currentStep`: entry practice, recommended game, Training Academy, or completion review.
- `unlockedGameModes`: modes currently available to the student.
- `completedGameModes`: modes already completed in this launch session.
- `earnedStarDust`: reward units earned so far. Tenant UI may rename this reward.
- `masteryStatus`: not started, in progress, mastered, or needs review.
- `lastEventAt`: optional timestamp of the latest progress event.

## Required Flow

1. Teacher opens `/teacher` and reviews the Teacher Launch Protocol.
2. System creates or displays a `LaunchSession` with status `open`.
3. Teacher shares the short classroom QR route `/launch/[code]`, or a printed textbook QR route resolves a stable identifier to the correct launch target.
4. If required by the tenant, student enters through `/enter/[tenantId]` with entry code and optional user code.
5. Student starts the `entryMode`.
6. Student can hear vocabulary, target sentences, instructions, feedback, and action labels through audio cues.
7. Completing entry practice emits `entry_practice_completed`.
8. System unlocks `recommendedNextModes`.
9. Student sees earned reward progress from deterministic mastery rewards.
10. Student starts the next mode, emitting `game_started`.
11. Student plays Memory Match by tapping hidden cards to hear and reveal terms.
12. Completing Memory Match emits `game_completed` and updates Star Dust.
13. Student may start approved unit media, emitting media progress events.
14. Future full gameplay modes emit standard game progress events.
15. Completion updates Star Dust, mastery status, visible session summary, and earned collection progress.
16. Teacher reporting can show game progress, media engagement, audio cue engagement when tracked, and Training Academy recommendations.

## Current Interactive Slice

Implemented behavior:

- `/launch/[code]` receives a sample `LaunchSession` and `StudentProgressionState`.
- `/enter/ministar` receives a sample front-door launch session and multimedia content package.
- The sample content package includes audio cue metadata for vocabulary terms, target sentences, student instructions, and basic feedback.
- Flashcard vocabulary, target sentences, instruction text, and entry feedback are tap-to-speak.
- Front-door open, flashcard completion, next-game start, and media actions use separate audio-supported action controls.
- Media playlist titles, media asset titles, and optional background-media titles are tap-to-speak.
- Memory Match instruction text, cards, mismatch feedback, and completion feedback are tap-to-speak.
- The student can open the front-door unit with sample entry and user codes.
- The student can mark flashcard entry practice complete.
- The local adapter records an `entry_practice_completed` event.
- The local adapter records `game_unlocked` events for recommended next modes.
- Star Dust increases through the shared scoring model.
- The earned reward preview unlocks deterministic rewards from the starter catalog.
- A reusable unit-session summary updates from progression state and the local event stream.
- Memory Match is unlocked as a progression state after flashcards.
- The student can start the unlocked Memory Match board.
- Starting the unlocked mode records a standard `game_started` event.
- Memory Match uses the pairing parent-engine state for cards, attempts, matches, and completion.
- Memory Match cards speak when tapped and use package audio cues when available.
- Completing Memory Match records a standard `game_completed` event and awards additional Star Dust.
- The student can start and complete sample media assets as progress events.
- The student can enable/disable optional background media after Memory Match starts.
- The teacher-visible report preview updates from the same local event stream and counts game completions.

Intentional limits:

- The current action-audio pattern is structural only; richer icon treatment, recorded audio, audio telemetry, and production playback providers are still future work.
- Progress is local component state only.
- No database persistence is introduced yet.
- No auth or classroom roster model is introduced yet.
- No premium visual polish is introduced yet.
- Permanent printed QR resolution is contracted but not implemented yet.
- Real multimedia playback is contracted but not implemented yet.

## Structural Guardrails

- QR routes should be short, readable, and classroom-safe.
- Launch codes should not expose private student information.
- Permanent printed QR routes should expose stable textbook identifiers only, not private student information.
- QR entry should not require a heavy login for young learners.
- Teacher approval remains required before AI-generated content is assigned to students.
- Route contracts must stay tenant-aware and avoid MiniStar-only assumptions.
- Student progression must use earned collection mechanics and avoid pressure-based reward loops.
- Learner-facing text must have audio support before a unit or game is student-ready.
- Multimedia must be controllable and must not be required for language-game completion.

## First Vertical Slice

The first slice should prove this path:

Teacher launch protocol -> QR route -> flashcard entry practice -> next game unlock -> playable Memory Match -> progress event -> Star Dust update -> earned reward preview -> unit-session summary update.

The current front-door expansion proves:

Front-door route -> entry-code/user-code -> sample multimedia package -> audio support plan -> playable Memory Match -> media event -> optional background media event -> student summary -> teacher-visible progress summary concept.

Only after that works should we add richer animation, mascot evolution, premium assets, or a full collection room.
