# Build Session Note: Playable Route Content Verification

Date: 2026-07-15

## Change

Changed Training Academy to use the shared launch resolver and added active route content checks for Training Academy, Quiz, Sentence Builder, and Speak It routes.

## Why

The sample publisher Training Academy route was loading with MiniStar fallback content. Content checks now catch that class of white-label route regression.

## Verification

- `npm run verify:foundation`

## Boundary

No new game modes, scoring changes, premium skins, or live classroom behavior were added.
