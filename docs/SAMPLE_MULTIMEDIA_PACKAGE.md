# Sample Multimedia Content Package

This document explains the first sample Living Textbook multimedia package implemented in the web app.

Canonical sample file:

- `apps/web/src/data/sampleMultimediaPackage.ts`

Visible concept panels:

- `apps/web/src/features/multimedia/MultimediaPackagePanel.tsx`
- `apps/web/src/features/multimedia/UnitMediaEngagementPanel.tsx`
- `apps/web/src/features/access/FrontDoorEntryFlow.tsx`
- `apps/web/src/features/access/FrontDoorTeacherReportPreview.tsx`
- `apps/web/src/features/teacher/TeacherProgressSummaryConcept.tsx`

Active sample routes:

- `/`
- `/launch/demo-unit-1`
- `/enter/ministar`

## Purpose

The sample proves that a Living Textbook unit can include more than a vocabulary/game payload.

The unit package includes:

- 1 Level 1 greetings unit
- flashcard entry practice
- Memory Match as the next unlocked game
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
5. Unlock and start Memory Match.
6. Start and complete sample media assets.
7. Enable or disable optional background media after Memory Match starts.
8. See the teacher-visible report preview update from the same local event stream.

## Multimedia Concept

The sample includes an audio chant and lesson video as package assets. It also includes a multimedia plan where the chant may be used as optional background/support media for Memory Match.

Background media is off by default and requires teacher enablement.

## Teacher Reporting Concept

The sample teacher report separates:

- launch opened
- flashcard completion
- Memory Match starts
- media starts/completions
- optional background media use
- average Star Dust

This separation is intentional. Media engagement should support learning, but it should not be merged into language mastery as an opaque score.
