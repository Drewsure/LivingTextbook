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

## Route Map

| Route | Audience | Status | Purpose |
| --- | --- | --- | --- |
| `/` | Platform / teacher | Active scaffold | Tenant overview, current unit, progression summary, multimedia package concept, and first sequence preview. |
| `/teacher` | Teacher | Active scaffold | Teacher Launch Protocol and classroom launch route for the selected unit. |
| `/launch/[code]` | Student | Active interactive slice | Short classroom QR entry route. Student starts with entry practice before next game unlocks. |
| `/enter/[tenantId]` | Student | Active interactive slice | Tenant-branded front door where students enter an entry code and optional user code before opening the unit package. |
| `/q/tenant/[tenantId]/series/[seriesId]/book/[bookId]/unit/[unitId]/activity/[activityId]` | Student / teacher | Future contract | Permanent printed textbook QR route that resolves a stable identifier to the current unit, game, media playlist, front door, or teacher preview. |
| `/media/[playlistId]` | Student / teacher | Future contract | Unit-linked playlist or media activity route resolved from a launch session, permanent QR, or teacher preview. |
| `/teacher/units/[unitKey]` | Teacher | Future | Unit-specific approval, content review, launch settings, media review, and class assignment. |
| `/teacher/sessions/[launchCode]` | Teacher | Future | Live classroom monitoring, media engagement, completion, Training Academy recommendations. |
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
- The same unit package can launch games, multimedia, rewards, and Training Academy review.

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
- Media buttons emit media progress events.
- Optional background media emits enabled/disabled events after Memory Match starts.
- A teacher-visible report preview summarizes game and media events together.

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
6. Completing entry practice emits `entry_practice_completed`.
7. System unlocks `recommendedNextModes`.
8. Student sees earned reward progress from deterministic mastery rewards.
9. Student starts the next mode shell, emitting `game_started`.
10. Student may start approved unit media, emitting media progress events.
11. Future full gameplay emits standard game progress events.
12. Completion updates Star Dust, mastery status, and earned collection progress.
13. Teacher reporting can show game progress, media engagement, and Training Academy recommendations.

## Current Interactive Slice

Implemented behavior:

- `/launch/[code]` receives a sample `LaunchSession` and `StudentProgressionState`.
- `/enter/ministar` receives a sample front-door launch session and multimedia content package.
- The student can open the front-door unit with sample entry and user codes.
- The student can mark flashcard entry practice complete.
- The local adapter records an `entry_practice_completed` event.
- The local adapter records `game_unlocked` events for recommended next modes.
- Star Dust increases through the shared scoring model.
- The earned reward preview unlocks deterministic rewards from the starter catalog.
- Memory Match is unlocked as a progression state after flashcards.
- The student can start the unlocked Memory Match shell.
- Starting the unlocked mode records a standard `game_started` event.
- The student can start and complete sample media assets as progress events.
- The student can enable/disable optional background media after Memory Match starts.
- The teacher-visible report preview updates from the same local event stream.

Intentional limits:

- Memory Match gameplay is not implemented in this slice.
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
- Multimedia must be controllable and must not be required for language-game completion.

## First Vertical Slice

The first slice should prove this path:

Teacher launch protocol -> QR route -> flashcard entry practice -> next game unlock -> progress event -> Star Dust update -> earned reward preview.

The current front-door expansion proves:

Front-door route -> entry-code/user-code -> sample multimedia package -> media event -> optional background media event -> teacher-visible progress summary concept.

Only after that works should we add richer animation, mascot evolution, premium assets, or a full collection room.
