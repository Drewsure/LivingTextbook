# Activity Pathway Compatibility Matrix

Document type: foundation compatibility contract

Related:

- `docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md`
- `docs/UNIT_GAME_OFFER_MAP_CONTRACT.md`
- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/FUTURE_REQUIREMENTS.md`

## Purpose

This matrix is the product-safe alternative to an unrestricted switch-template panel.

Living Textbook should give teachers streamlined, pre-reviewed options for each unit theme. A reviewed unit package may offer several ready activities, but every offered output must preserve:

- target-language progression,
- learner audio support,
- deterministic scoring or clear no-score status,
- teacher reporting rules,
- tenant/package policy,
- support-language boundaries,
- and white-label governance.

## Current Sample

Current sample data:

- `apps/web/src/data/sampleActivityPathwayCompatibility.ts`

Current panel:

- `apps/web/src/features/game-offers/ActivityPathwayCompatibilityPanel.tsx`

Current route:

- `/teacher/intake`

Current verifier:

- `npm run verify:activity-pathways`

## Compatibility Statuses

Offered:
- Valid now for the reviewed sample package.
- Can be visible as a teacher-approved student option.

Planned:
- Strategically accepted, but not implemented yet.
- Should remain visible in planning so future work does not forget it.

Teacher review:
- Requires explicit teacher or school approval before use.
- Typical for microphone, assessment, sensitive feedback, or privacy-adjacent modes.

Premium:
- Requires tenant/package entitlement.
- Must not create in-child upsell pressure.

Blocked:
- Not available until the named compatibility rule is satisfied.
- Must not appear in normal student progression.

## Current Sample Pathway

Offered:

- Entry Flashcards
- Memory Match
- Teacher Review Quiz
- Sentence Builder

Teacher review:

- Speak It Practice

Planned printables:

- Printable vocabulary sheet
- Printable sentence practice

Premium:

- Balloon Pop

Blocked conversions:

- Word Search until text-only printable puzzle rules and layout validation exist.
- Crossword until reviewed clue text and text-only puzzle validation exist.

## Standing Rules

- Curated pathways are the default teacher-facing experience.
- Support language cannot unlock progress.
- Target-language practice remains the progression trigger.
- Printable outputs must come from reviewed package data.
- Printable QR or short links should resolve to reviewed audio cues where young learners need listening support.
- Text puzzle outputs require text normalization and layout validation.
- Crossword outputs require reviewed clue text, not only vocabulary terms.
- Premium arcade modes require teacher controls, accessibility settings, audio clarity, and standard events.
- Japanese or other non-space-delimited target languages need reviewed segmentation rules before sentence or puzzle conversion.

## Follow-Up

Promote this sample shape into a shared package contract after teacher authoring and printable output requirements are clearer.
