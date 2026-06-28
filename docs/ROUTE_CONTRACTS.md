# Teacher QR Launch And Student Progression Route Contracts

This document defines the clean route and state contracts for the first Living Textbook vertical slice. It is intentionally structural. Visual polish, premium mascot work, animation, and collection-room art come later.

## Goals

- Preserve teacher-led QR onboarding from day one.
- Preserve student self-progression from day one.
- Keep route behavior tenant-aware and curriculum-aware.
- Keep launch state separate from visual presentation.
- Give future auth, database, and classroom-monitoring work a stable contract.
- Support permanent printed QR identifiers for textbook companion products.

## Route Map

| Route | Audience | Status | Purpose |
| --- | --- | --- | --- |
| `/` | Platform / teacher | Active scaffold | Tenant overview, current unit, progression summary, first sequence preview. |
| `/teacher` | Teacher | Active scaffold | Teacher Launch Protocol and classroom launch route for the selected unit. |
| `/launch/[code]` | Student | Active interactive slice | Short classroom QR entry route. Student starts with entry practice before next game unlocks. |
| `/q/tenant/[tenantId]/series/[seriesId]/book/[bookId]/unit/[unitId]/activity/[activityId]` | Student / teacher | Future contract | Permanent printed textbook QR route that resolves a stable identifier to the current unit, game, media playlist, or teacher preview. |
| `/teacher/units/[unitKey]` | Teacher | Future | Unit-specific approval, content review, launch settings, and class assignment. |
| `/teacher/sessions/[launchCode]` | Teacher | Future | Live classroom monitoring, completion, Training Academy recommendations. |
| `/student/progress` | Student | Future | Lightweight return route for unlocked games, rewards, and mastery status. |
| `/training/[code]` | Student | Future | Remedial or adaptive Training Academy route for targeted review. |

## Permanent QR Contract

Permanent QR routes are different from short classroom launch codes.

Short launch codes are useful for a teacher's live class session. Printed textbook QR codes must survive reprints, app updates, content package revisions, and deployment changes.

Required permanent QR identity fields:

- `tenantId`: white-label tenant or publisher.
- `seriesId`: textbook series.
- `bookId`: book or level.
- `unitId`: textbook unit.
- `activityId`: target activity, game, playlist, or teacher preview.
- `language`: optional language code.
- `edition`: optional printed edition.
- `version`: optional content package version.

Permanent QR rules:

- Printed QR codes must resolve stable identifiers, not local files or temporary development paths.
- Permanent QR routes may resolve into `/launch/[code]`, a media playlist, a game mode, or a teacher preview depending on the target type.
- A local/closed app may resolve the same identifier from an installed content package.
- A hosted redirect may resolve the same identifier when long-term external permanence is required.
- Do not promise pure offline printed QR behavior unless the installed app, deep link, content package, and update model are explicit.

## Launch Session Contract

A launch session is the bridge between teacher action and student QR entry.

Required fields:

- `launchCode`: short route-safe code used in `/launch/[code]`.
- `tenantId`: white-label tenant identifier.
- `curriculumId`: curriculum identifier.
- `unitKey`: stable unit identity.
- `status`: draft, open, locked, expired, or completed.
- `accessMode`: teacher QR, permanent QR, teacher preview, or student return.
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
4. Student enters through the QR route and starts the `entryMode`.
5. Completing entry practice emits `entry_practice_completed`.
6. System unlocks `recommendedNextModes`.
7. Student sees earned reward progress from deterministic mastery rewards.
8. Student starts the next mode shell, emitting `game_started`.
9. Future full gameplay emits standard game progress events.
10. Completion updates Star Dust, mastery status, and earned collection progress.
11. If mastery is low, teacher or system recommends Training Academy.

## Current Interactive Slice

Implemented behavior:

- `/launch/[code]` receives a sample `LaunchSession` and `StudentProgressionState`.
- The student can mark flashcard entry practice complete.
- The local adapter records an `entry_practice_completed` event.
- The local adapter records `game_unlocked` events for recommended next modes.
- Star Dust increases through the shared scoring model.
- The earned reward preview unlocks deterministic rewards from the starter catalog.
- Memory Match is unlocked as a progression state after flashcards.
- The student can start the unlocked Memory Match shell.
- Starting the unlocked mode records a standard `game_started` event.
- The student-facing progress summary updates with earned Star Dust and session update count.

Intentional limits:

- Memory Match gameplay is not implemented in this slice.
- Progress is local component state only.
- No database persistence is introduced yet.
- No auth or classroom roster model is introduced yet.
- No premium visual polish is introduced yet.
- Permanent printed QR resolution is contracted but not implemented yet.

## Structural Guardrails

- QR routes should be short, readable, and classroom-safe.
- Launch codes should not expose private student information.
- Permanent printed QR routes should expose stable textbook identifiers only, not private student information.
- QR entry should not require a heavy login for young learners.
- Teacher approval remains required before AI-generated content is assigned to students.
- Route contracts must stay tenant-aware and avoid MiniStar-only assumptions.
- Student progression must use earned collection mechanics and avoid pressure-based reward loops.

## First Vertical Slice

The first slice should prove this path:

Teacher launch protocol -> QR route -> flashcard entry practice -> next game unlock -> progress event -> Star Dust update -> earned reward preview.

Only after that works should we add richer animation, mascot evolution, premium assets, or a full collection room.
