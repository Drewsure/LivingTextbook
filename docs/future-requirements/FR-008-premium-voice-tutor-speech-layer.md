# FR-008: Premium Voice Tutor Speech Layer

Status: Planned premium package; foundation dashboard readiness surface exists.

## Requirement

Living Textbook should support an optional premium Voice Tutor layer for tenants that adopt AI Tutor. The goal is to provide speech practice, pronunciation support, fluency support, transcript matching, and bounded role-play coaching without making the core platform depend on AI or speech-service costs.

## Product Position

The Voice Tutor layer is inspired by modern AI voice-coaching products, but Living Textbook must own its own architecture and product boundaries.

It should be saleable as a white-label premium package for:

- upper-level MiniStar English learners,
- textbook publishers adding speaking practice to print/PDF units,
- schools wanting teacher-controlled oral practice,
- local/offline companion deployments where cloud AI is not acceptable.

## Build Order

1. Browser record/replay prototype with no model call and no default storage.
2. Unit-scoped transcript matching against approved vocabulary and sentence patterns.
3. Deterministic expected-text scoring before open-ended AI comments.
4. Pronunciation and fluency signals after QA and teacher-review rules exist.
5. Bounded conversational role play only after entitlement, moderation, and reporting contracts are accepted.

## Cost And Safety Rules

- Voice Tutor must be premium or enterprise entitlement only.
- Tenants must be able to disable it fully.
- Schools and teachers must be able to control allowed levels and modes.
- Microphone capture must require explicit student/teacher UX and privacy review.
- Raw audio and transcripts must not be stored by default.
- Feedback must be encouraging, developmentally appropriate, and teacher-reviewable.
- No open-ended child chatbot is allowed.

## Open-Source Research Queue

Research candidates may include:

- `whisper.cpp` for local speech-to-text investigation.
- `Montreal Forced Aligner` for alignment and pronunciation scoring investigation.
- replaceable local TTS engines only after license review.
- public pronunciation-assessment repositories only after license, maintenance, and safety review.

No external repository is approved for production import by this requirement alone.

## Current Slice Acceptance

- Dashboard shows a premium speech-layer readiness surface.
- Voice Tutor remains disabled for the Level 1 sample.
- The student QR/front-door slice does not request microphone access.
- Normal student progression does not depend on AI Tutor or Voice Tutor.
- Documentation records the capability ladder and cost/safety boundaries.
