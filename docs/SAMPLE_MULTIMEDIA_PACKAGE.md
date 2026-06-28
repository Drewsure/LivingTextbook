# Sample Multimedia Content Package

This document explains the first sample Living Textbook multimedia package implemented in the web app.

Canonical sample file:

- `apps/web/src/data/sampleMultimediaPackage.ts`

Visible concept panels:

- `apps/web/src/features/multimedia/MultimediaPackagePanel.tsx`
- `apps/web/src/features/teacher/TeacherProgressSummaryConcept.tsx`

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
- Front-door route: `/enter/ministar`, where an entry code and optional user code can later connect progress to teacher reports

## Multimedia Concept

The sample includes an audio chant and lesson video as package assets. It also includes a multimedia plan where the chant may be used as optional background/support media for Memory Match.

Background media is off by default and requires teacher enablement.

## Teacher Reporting Concept

The sample teacher report separates:

- flashcard completion
- Memory Match starts
- media starts/completions
- optional background media use
- average Star Dust

This separation is intentional. Media engagement should support learning, but it should not be merged into language mastery as an opaque score.
