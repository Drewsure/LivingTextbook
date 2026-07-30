# ADR 0286: AI Generator Audio Coverage Plan

Status: Accepted  
Date: 2026-07-31

## Decision

Add a review-only AI generator audio coverage plan to the teacher generator route.

The plan enumerates learner-facing target-language audio cues for terms, sentences, instructions, feedback, and critical controls. It also records support-language audio as support-only and blocks background media from counting toward mastery.

## Rationale

Young learners and English learners need audio support for text. AI-generated game packages therefore cannot be treated as usable until their audio obligations are visible and reviewable. This also protects the white-label product from accidental voice API costs, unapproved synthetic voices, and media-only progress shortcuts.

## Consequences

- Generated drafts must produce `ai_audio_coverage_plan`, `audio_cue_manifest`, and `package_game_audio_coverage` records before package review.
- Live voice generation, synthetic voice use, voice API cost, and student route creation remain blocked.
- Background music and video audio stay enrichment only; learning audio remains the priority.
