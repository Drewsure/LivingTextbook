# AI Authoring Verifier Handoff

Document type: implementation contract

Status: active scaffold

## Purpose

The AI authoring verifier handoff defines how AI-generated or AI-assisted draft content moves toward a reviewed Living Textbook package.

AI can draft structure. It cannot publish student-facing content by itself.

## Required Stages

- Draft from reviewed source item.
- Schema and pedagogy check.
- Learner audio coverage check.
- Assist-language review.
- Media rights and manifest check.
- Teacher/package approval.

## Release Rule

No AI draft, PDF extraction, translation, visual prompt, or media match becomes student-facing until verifier and teacher review gates are complete.

Teacher authoring follows the same rule. Fast authoring creates draft packages only; direct AI publish and direct draft assignment are blocked.

## Required Rejections

The verifier/handoff must reject:

- Unmapped raw PDF pages.
- Unowned media files.
- Open-ended student chat prompts.
- Too many vocabulary terms.
- Missing target sentence patterns.
- Unknown game modes.
- Cross-tenant references.
- Silent learner instructions.
- Text-only early learner controls.
- Support language as a progression trigger.
- Unreviewed live translation.
- Unknown media ownership.

## Current Scaffold

`/teacher/intake` now shows this handoff as a review panel between source review and package release.

This is still a scaffold. It does not call a live model, run production verification, or assign AI output directly to students.

Related teacher authoring readiness contract:

- `docs/TEACHER_AUTHORING_READINESS_CONTRACT.md`
