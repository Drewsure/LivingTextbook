# Teacher QR Launch And Student Progression Route Contracts

This document defines the clean route and state contracts for the first Living Textbook vertical slice. It is intentionally structural. Visual polish, premium mascot work, animation, and collection-room art come later.

## Goals

- Preserve teacher-led QR onboarding from day one.
- Preserve student self-progression from day one.
- Keep route behavior tenant-aware and curriculum-aware.
- Keep launch state separate from visual presentation.
- Give future auth, database, and classroom-monitoring work a stable contract.

## Route Map

| Route | Audience | Status | Purpose |
| --- | --- | --- | --- |
| `/` | Platform / teacher | Active scaffold | Tenant overview, current unit, progression summary, first sequence preview. |
| `/teacher` | Teacher | Active scaffold | Teacher Launch Protocol and classroom launch route for the selected unit. |
| `/launch/[code]` | Student | Active interactive slice | QR entry route. Student starts with entry practice before next game unlocks. |
| `/teacher/units/[unitKey]` | Teacher | Future | Unit-specific approval, content review, launch settings, and class assignment. |
| `/teacher/sessions/[launchCode]` | Teacher | Future | Live classroom monitoring, completion, Training Academy recommendations. |
| `/student/progress` | Student | Future | Lightweight return route for unlocked games, rewards, and mastery status. |
| `/training/[code]` | Student | Future | Remedial or adaptive Training Academy route for targeted review. |

## Launch Session Contract

A launch session is the bridge between teacher action and student QR entry.

Required fields:

- `launchCode`: short route-safe code used in `/launch/[code]`.
- `tenantId`: white-label tenant identifier.
- `curriculumId`: curriculum identifier.
- `unitKey`: stable unit identity.
- `status`: draft, open, locked, expired, or completed.
- `accessMode`: teacher QR, teacher preview, or student return.
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
3. Teacher shares the QR route `/launch/[code]`.
4. Student enters `/launch/[code]` and starts the `entryMode`.
5. Completing entry practice emits `entry_practice_completed`.
6. System unlocks `recommendedNextModes`.
7. Student starts the next mode shell, emitting `game_started`.
8. Future full gameplay emits standard game progress events.
9. Completion updates Star Dust, mastery status, and earned collection progress.
10. If mastery is low, teacher or system recommends Training Academy.

## Current Interactive Slice

Implemented behavior:

- `/launch/[code]` receives a sample `LaunchSession` and `StudentProgressionState`.
- The student can mark flashcard entry practice complete.
- The local adapter records an `entry_practice_completed` event.
- The local adapter records `game_unlocked` events for recommended next modes.
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

## Structural Guardrails

- QR routes should be short, readable, and classroom-safe.
- Launch codes should not expose private student information.
- QR entry should not require a heavy login for young learners.
- Teacher approval remains required before AI-generated content is assigned to students.
- Route contracts must stay tenant-aware and avoid MiniStar-only assumptions.
- Student progression must use earned collection mechanics and avoid pressure-based reward loops.

## First Vertical Slice

The first slice should prove this path:

Teacher launch protocol -> QR route -> flashcard entry practice -> next game unlock -> progress event -> Star Dust update -> earned reward preview.

Only after that works should we add richer animation, mascot evolution, premium assets, or a full collection room.
