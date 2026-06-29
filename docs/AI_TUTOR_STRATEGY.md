# Living Textbook AI Tutor Strategy

Document type: future requirement and product architecture note

Status: Planned upper-level capability; not part of the first foundation slice

Related standards:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/FUTURE_REQUIREMENTS.md`
- `docs/DECISION_REGISTER.md`
- `docs/adr/0007-bounded-ai-tutor-upper-levels.md`

## Summary

The Living Textbook platform should support an AI tutor layer for older or more advanced learners, especially in upper curriculum levels where students can benefit from guided speaking, writing, correction, explanation, and adaptive review.

This should be designed now, but implemented after the core white-label foundation is stable.

The AI tutor must be curriculum-aware, tenant-configurable, bounded, teacher-visible, and optional. It must not become a general open-ended chatbot inside a children's learning platform.

## Product Position

AI tutoring is a strong white-label differentiator.

For MiniStar, it can support advanced English practice in later levels. For future textbook partners, it can become a premium layer that turns static PDF or textbook material into interactive speaking, writing, review, and coaching experiences.

The tutor should sit on top of the Living Textbook content package model:

- Tenant
- Curriculum
- Level
- Unit
- Approved vocabulary
- Target sentence structures
- Teacher launch protocol
- Multimedia assets
- Game events
- Student progress events
- Audio cue plan
- Verifier rules

It should not bypass those structures.

## Build Timing

Do not implement the full AI tutor before the foundation slice is verified.

Required foundation before active tutor implementation:

1. Stable QR/front-door launch flow.
2. Audio-first flashcard practice.
3. At least one playable game mode with standard events.
4. Progress summary and teacher-visible report preview.
5. Multimedia package model.
6. Content package validation.
7. Basic tenant configuration boundary.
8. A clear privacy and safety posture.

Until then, AI tutor work should be limited to schemas, requirements, route placeholders, data contracts, and future design notes.

## Target Learners

The tutor is mainly for upper levels and advanced students.

Recommended availability:

- Lower levels: no open AI tutor; use structured audio, flashcards, games, and teacher guidance.
- Middle levels: optional highly constrained review prompts, if needed.
- Upper levels: guided tutor modes for speaking, writing, correction, role play, and explanation.

MiniStar mapping:

- Levels 1-3: game-led and audio-led only.
- Levels 4-5: possible teacher-controlled review assistant later.
- Levels 6-8: active AI tutor candidate.

Tenant mapping must be configurable. Other textbook partners may define different age bands or maturity gates.

## Core Tutor Modes

The first AI tutor should be built as several bounded modes, not one general chat surface.

Candidate modes:

- Speak With Me: unit vocabulary and target-sentence speaking practice.
- Fix My Sentence: student receives correction and a short explanation.
- Explain My Mistake: tutor explains errors after game attempts.
- Role Play: controlled dialogue using approved unit language.
- Writing Coach: guided sentence or paragraph building for upper levels.
- Review Coach: adaptive review based on missed game events.
- Teacher Prompt Mode: teacher launches a specific approved tutor activity.

Each mode must define:

- Allowed input type.
- Allowed source content.
- Response length range.
- Required safety checks.
- Teacher visibility level.
- Whether audio input/output is enabled.
- Whether the response can affect scoring.

## Non-Negotiable Guardrails

The tutor must be bounded by unit and tenant rules.

Required constraints:

- No open-ended general chatbot for children.
- No tutor response should ignore the current unit, tenant curriculum, or teacher-approved content.
- No model should invent curriculum facts, reward outcomes, grades, or teacher instructions.
- No private or sensitive student data should be exposed in prompts unless a privacy model has been approved.
- No AI response should be assigned to students without safety and curriculum checks appropriate to the mode.
- No direct replacement of teacher authority.
- No always-on companion relationship that encourages dependency.
- No hidden paid usage loops or runaway model-cost behavior.

The tutor should feel helpful, calm, and encouraging, but it is a learning tool, not an unbounded friend.

## Data Contract Direction

Future content packages should be able to include optional tutor metadata.

Potential fields:

```json
{
  "ai_tutor_plan": {
    "enabled": true,
    "minimum_level": 6,
    "allowed_modes": ["fix_my_sentence", "role_play", "review_coach"],
    "source_scope": "current_unit_only",
    "approved_terms": ["term_1", "term_2"],
    "approved_sentence_patterns": ["pattern_1", "pattern_2"],
    "teacher_review_required": false,
    "student_audio_input": true,
    "student_audio_output": true,
    "max_response_sentences": 4
  }
}
```

This is a planning shape, not a final schema.

## Teacher Reporting

Tutor interactions should produce teacher-visible learning summaries without exposing unnecessary raw conversation details.

Recommended report events:

- Tutor session started.
- Tutor mode selected.
- Unit content referenced.
- Skill focus.
- Common mistake category.
- Suggested review mode.
- Teacher attention flag.
- Tutor session completed.

Possible summary examples:

- Student needs more practice with adjective order.
- Student can use target vocabulary but struggles with past tense.
- Student repeated the target sentence successfully after correction.
- Student requested three explanations for the same grammar point.

Privacy-sensitive raw transcripts should not be stored by default unless the tenant, school, parent policy, and deployment rules explicitly allow it.

## Cost And Infrastructure Notes

AI tutor capability can create recurring model, speech, moderation, storage, and latency costs.

Cost-control requirements:

- Tutor availability should be tenant configurable.
- Tutor modes should use short bounded prompts and responses.
- The system should prefer current-unit context over large retrieval calls when possible.
- Speech-to-text and text-to-speech should be optional and configurable.
- Usage limits should exist by tenant, class, unit, and student session.
- Teacher review and deterministic games should remain useful when AI is disabled.

The platform must remain saleable without forcing every tenant into high AI operating costs.

## White-Label Requirements

The tutor must not be MiniStar-specific.

Tenant-configurable items:

- Tutor name and branding.
- Tutor visual identity or no visual identity.
- Allowed levels or age ranges.
- Allowed modes.
- Curriculum boundaries.
- Safety rules.
- Tone and formality.
- Voice/accent if audio output exists.
- Data retention rules.
- Whether teacher approval is required.

MiniStar may use the tutor with its own Cloud Dog, Star Kid, or future avatar concepts, but those motifs must not be hard-coded as universal tutor assumptions.

## Acceptance Criteria For First Tutor Prototype

A first prototype is acceptable only when it can demonstrate:

1. One upper-level unit loaded from structured content.
2. Tutor mode limited to approved vocabulary and two target sentences.
3. No response outside the allowed unit scope.
4. Short correction or explanation output.
5. Audio-first support if used with young or language-learning students.
6. Teacher-visible summary event.
7. Clear opt-in route or teacher launch.
8. Basic cost guardrail such as short responses and session limit.
9. No impact on deterministic game progression unless explicitly designed.
10. A verification checklist update.

## Immediate Build Instruction

For now, do not build the AI tutor UI or service.

Preserve the requirement, keep schemas extensible, and avoid architecture choices that would make a bounded tutor impossible later.

Next appropriate work remains:

- Sync and verify `legacy-source-import` locally.
- Stabilize the current flashcard -> Memory Match -> progress summary slice.
- Continue clean component and event contracts.
- Add future tutor metadata only when it naturally fits content package modeling.
