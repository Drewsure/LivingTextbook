# AI Teaching Game Generator Checks

Document type: focused verification supplement  
Status: active scaffold  
Last updated: 2026-07-31

Run `npm run verify:ai-generator` after changing AI authoring, generator requests, activity pathway generation, target-language audio rules, premium AI Tutor plan data, or teacher generator routes.

Confirm:

- The generator creates draft package requests only.
- No direct AI publish is available.
- No live model call is available.
- No student assignment is available from a generated draft.
- No unreviewed activity conversion is available.
- No support-language-only progression is available.
- No API cost without tenant approval is allowed.
- No premium upsell is shown to children.
- 8 default vocabulary terms remains the canonical unit default.
- 8-12 allowed terms remains the bounded extension range.
- Exactly 2 target sentence structures are required.
- JSON-first draft package payload is required.
- Curated activity pathway is required instead of switch-to-anything.
- Every target-language text needs audio.
- Support language cannot unlock progress.
- Verifier packet required before package review.
- Prompt package preview shows a reviewed template version, input slots, output schema locks, tenant rules, model-use state, usage budget, and cost controls.
- Prompt package preview blocks raw student data, student prompt editing, live model use, voice generation, tenant billing, and student assignment.
- `teacher_draft_package`, `teacher_draft_verifier_submission`, `activity_compatibility_snapshot`, and `package_game_audio_coverage` records are named before package review.
- Draft JSON preview keeps `target_language_progress_trigger` as `target-language-only`.
- Draft JSON preview keeps `support_language_progress_allowed: false`.
- Draft JSON preview blocks copy, verifier submission, publish, playlist creation, and assignment.
- Disabled request builder shows source evidence packet, target level, unit theme, target language, support-language policy, curated mode pathway, audio coverage requirement, and AI package state.
- Disabled request builder blocks generation, API cost estimation, request submission, live prompt dispatch, model billing, route creation, and student assignment.
- Audio coverage planner shows `ai_audio_coverage_plan`, `audio_cue_manifest`, and `package_game_audio_coverage` before generated packages can be reviewed.
- Audio coverage planner enumerates target-language term audio, sentence audio, instruction audio, feedback audio, and critical control audio.
- Audio coverage planner keeps support-language audio support-only and blocks media-only listening from counting toward mastery.
- Audio coverage planner blocks live synthetic voice generation and voice API cost until tenant approval.
- Mode recommendation preview reuses the activity compatibility matrix.
- Mode recommendation preview shows a recommended generated pathway and blocked conversion guardrails.
- Mode recommendation preview blocks a broad switch panel as the default product promise.
- Optional AI Tutor requests remain premium-gated and disabled until school adoption, privacy, transcript, usage-limit, and cost controls exist.
- `/teacher/generator/sample-publisher` loads as a teacher/admin route.
- `/teacher/intake` includes the generator foundation panel.
