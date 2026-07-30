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
- `teacher_draft_package`, `teacher_draft_verifier_submission`, `activity_compatibility_snapshot`, and `package_game_audio_coverage` records are named before package review.
- Draft JSON preview keeps `target_language_progress_trigger` as `target-language-only`.
- Draft JSON preview keeps `support_language_progress_allowed: false`.
- Draft JSON preview blocks copy, verifier submission, publish, playlist creation, and assignment.
- Disabled request builder shows source evidence packet, target level, unit theme, target language, support-language policy, curated mode pathway, audio coverage requirement, and AI package state.
- Disabled request builder blocks generation, API cost estimation, request submission, live prompt dispatch, model billing, route creation, and student assignment.
- Optional AI Tutor requests remain premium-gated and disabled until school adoption, privacy, transcript, usage-limit, and cost controls exist.
- `/teacher/generator/sample-publisher` loads as a teacher/admin route.
- `/teacher/intake` includes the generator foundation panel.
