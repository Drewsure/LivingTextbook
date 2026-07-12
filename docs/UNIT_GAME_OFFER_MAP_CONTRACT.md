# Unit Game Offer Map Contract

The unit game offer map defines which games are available for a reviewed textbook unit and what conditions apply before a game becomes student-facing.

This contract exists because white-label publishers need to maintain yearly game offerings without creating one-off pages or breaking progress reporting.

## Purpose

A unit game offer map answers:

- Which games are required for this unit?
- Which games are optional enrichment?
- Which games are premium package features?
- Which games are teacher-only or hidden until reviewed?
- Which parent engine renders each game?
- Which audio, media, teacher-control, route, and reporting rules apply?
- Which activity outputs are compatible, planned, teacher-review-only, premium, or blocked?

## Availability States

Required:
- Part of the normal student progression path.
- Must have audio support, route, scoring, and progress events.

Optional:
- Available enrichment after the required path.
- Must still report standard progress events.

Premium:
- Requires tenant/package entitlement.
- Must not become an in-child upsell or pressure loop.

Teacher-only:
- Available only when launched or approved by the teacher.
- Useful for microphone, assessment, or classroom-led activities.

Hidden:
- Present in planning but not visible to students.
- Often used for future modes, unreviewed payloads, or assessment payloads.

Blocked:
- Not available until the named blocker is resolved.

## Required Fields

Every offer should identify:

- unit key,
- unit label,
- game mode,
- game family,
- parent engine,
- availability,
- readiness,
- package tier,
- launch route when available,
- audio requirement,
- media requirement,
- teacher controls,
- evidence,
- next step,
- not-allowed-yet guardrails.

## Standing Rules

- Do not build 48 separate games.
- Do not offer unrestricted switch-template behavior as the core promise.
- Use curated, teacher-approved activity pathways for each reviewed unit package.
- Every offered game maps to a reusable parent engine.
- Every offered game has learner-facing audio requirements.
- Background music/video is optional and separate from comprehension audio.
- Premium game availability is tenant/package configuration, not child-facing pressure.
- Teacher-only microphone games cannot start microphones automatically.
- Hidden or blocked modes cannot appear in normal student progression.
- Student-facing game offers must emit standard progress events.
- Printable activities must be generated from reviewed package data and should preserve audio/QR support where needed.
- Text puzzle conversions require text normalization, layout validation, and reviewed clue rules where applicable.
- Non-space-delimited target languages require reviewed segmentation rules before sentence or puzzle conversion.

## Current Implementation

- Sample data: `apps/web/src/data/sampleUnitGameOfferMap.ts`
- Compatibility sample: `apps/web/src/data/sampleActivityPathwayCompatibility.ts`
- Panel: `apps/web/src/features/game-offers/UnitGameOfferMapPanel.tsx`
- Compatibility panel: `apps/web/src/features/game-offers/ActivityPathwayCompatibilityPanel.tsx`
- Route: `/teacher/intake`

## Follow-Up

Promote this sample shape into `packages/content-model` after the admin contract is reviewed and before production persistence is selected.
