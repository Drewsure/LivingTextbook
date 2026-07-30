# AI Teaching Game Generator Contract

Document type: implementation contract  
Status: active scaffold  
Last updated: 2026-07-31

## Purpose

The AI teaching game generator is a teacher/admin authoring aid for the white-label Living Textbook platform. It helps convert reviewed source material into structured game-package drafts.

It does not create production game code, publish routes, assign student work, or call a live model in the foundation scaffold.

## Core Rule

AI teaching game generator creates draft package requests, verifier packets, audio-coverage plans, activity pathway proposals, media-needs notes, and teacher launch copy.

The generator cannot bypass source review, package review, target-language audio coverage, media rights, activity compatibility, teacher approval, package publish gates, launch safety, or school policy gates.

## Required Output Rules

- 8 default vocabulary terms.
- 8-12 allowed terms when a reviewed unit genuinely requires extension.
- Exactly 2 target sentence structures.
- JSON-first draft package payload.
- Curated activity pathway rather than switch-to-anything.
- Every target-language text needs audio.
- Support language cannot unlock progress.
- Teacher Launch Protocol required.
- Verifier packet required before package review.

## Required Draft Records

- `teacher_draft_package`
- `teacher_draft_verifier_submission`
- `activity_compatibility_snapshot`
- `package_game_audio_coverage`
- `media_playlist_binding` when media is part of the request.
- `ai_tutor_entitlement_packet` when optional AI Tutor is part of the request.

## Draft Payload Preview Rule

The teacher generator route may show a Draft JSON preview so reviewers can understand the output shape. The preview must preserve `target_language_progress_trigger`, `support_language_progress_allowed: false`, `teacher_draft_verifier_submission`, and blocked actions for copy, verifier submission, publish, playlist creation, and assignment until storage and review workflows exist.

## Request Builder Rule

The teacher generator route may show a disabled request-builder form for source evidence packet, target level, unit theme, target language, assist-language policy, curated mode pathway, audio coverage requirement, and AI package state. The form must keep generation, API cost estimation, request submission, live prompt dispatch, model billing, route creation, and student assignment blocked until the premium AI package, persistence, verifier, and approval workflows exist.

## Prompt Package Rule

Future AI generation must run from reviewed, versioned, tenant-scoped prompt packages. A prompt package must name its template version, input slots, output schema locks, tenant brand rules, model-use state, usage budget, and cost controls. It must block raw student data, student prompt editing, live model use, voice generation, tenant billing, and student assignment until the tenant has approved the correct AI package and storage/review controls exist.

## Mode Recommendation Rule

Generator mode recommendations must reuse the reviewed activity compatibility matrix. The generator can recommend a tight pathway for a unit, but it must not produce a broad switch panel or unsupported conversions. Blocked conversions stay visible with their payload-fit and compatibility-rule reasons.

## Audio Coverage Planner Rule

Generated game requests must produce an `ai_audio_coverage_plan` before review. The plan must enumerate target-language term audio, sentence audio, instruction audio, feedback audio, and critical control audio; name the `audio_cue_manifest` and `package_game_audio_coverage` records; keep support-language audio support-only; and block background music or video sound from counting toward mastery. Live synthetic voice generation and voice API cost remain blocked until a tenant approves the premium package and storage/review controls exist.

## Gamification Mapping Rule

Generated game requests must produce an `ai_gamification_mapping_plan` before review. The plan must name accepted game events, Star Dust allocation lanes, mastery thresholds, `game_scoring_profile_snapshot`, `progress_event_acceptance_map`, and `collection_unlock_binding` records. AI generation cannot create random rewards, generated gacha, purchase-like unlocks, support-language-only mastery, media-only Star Dust, or unreviewed score profiles.

## Blocked Actions

- No direct AI publish.
- No live model call.
- No student assignment.
- No unreviewed activity conversion.
- No support-language-only progression.
- No generated media prompt as production artwork.
- No API cost without tenant approval.
- No premium upsell shown to children.

## White-Label Position

MiniStar is a reference tenant. Other publishers can define their own curriculum, target language, support language, media policy, avatar family, reward naming, visual blacklist, and premium AI package state.

Japanese can be a target language in a future tenant if the content and game payloads are built around Japanese as the target-language trigger. That is different from Japanese assist language inside MiniStar English units.

## Verification

Run:

```powershell
npm run verify:ai-generator
```

The foundation hard gate also includes this check through:

```powershell
npm run verify:foundation
```
