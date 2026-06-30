# ADR 0016: Premium Voice Tutor Speech Layer

Status: Accepted

Date: 2026-07-01

## Context

Voice-coaching products such as Vocal Image show a strong product direction: learners can record speech, get feedback, improve fluency, and feel personally coached. This is highly relevant to a white-label Living Textbook platform, especially for upper-level speaking practice and partner textbook packages.

However, active speech assessment can introduce recurring costs, privacy duties, moderation needs, child-safety review, infrastructure complexity, and vendor lock-in.

## Decision

Living Textbook will include a premium voice-tutor capability lane, but it will remain optional, tenant-gated, and replaceable.

The platform should treat external products such as Vocal Image as product inspiration, not as dependencies. Open-source or replaceable components may be researched for speech-to-text, forced alignment, pronunciation scoring, and local/offline speech support, but no repository or model may be imported without license, privacy, performance, and integration review.

The voice-tutor lane is represented in the build as:

- a voice-tutor capability catalog,
- a dashboard/package readiness panel,
- tenant AI Tutor entitlement checks,
- disabled-by-default sample package behavior,
- future requirement and verification documentation.

## Capability Ladder

The premium voice layer should progress in this order:

1. Record and replay: browser-only capture, no model call, no default storage.
2. Transcript match: compare learner speech against assigned unit text.
3. Expected-text and sentence-pattern checks: deterministic review before open-ended feedback.
4. Pronunciation and fluency feedback: premium-gated, teacher-reviewable, age-appropriate.
5. Bounded role play: approved curriculum scope only, with usage limits and moderation.

## Open-Source Research Candidates

Initial research candidates include:

- `whisper.cpp` for local/offline speech-to-text investigation.
- `Montreal Forced Aligner` for alignment and pronunciation-assessment investigation.
- `Piper TTS` or equivalent replaceable TTS only after license review.
- Other public repositories only after provenance, maintenance, license, and safety review.

These are candidates for research, not approved dependencies.

## Consequences

Positive:

- Preserves a cutting-edge premium product path.
- Keeps the core platform cost-efficient and useful without AI Tutor.
- Supports white-label packaging for publishers, schools, and academies.
- Allows local/offline partner deployments to explore speech support later.

Tradeoffs:

- Speech scoring requires careful QA and age-appropriate feedback design.
- Audio capture and transcript storage require explicit privacy rules.
- Commercial licensing and model/service costs must be managed per tenant.
- The first current-slice implementation is a readiness surface, not an active tutor.

## Verification

- Core QR launch, flashcards, Memory Match, Training Academy, multimedia, rewards, and teacher reports must work when Voice Tutor is disabled.
- Voice Tutor must appear as premium/planned package information, not as a required student step.
- No model calls, microphone prompts, speech uploads, or external speech services are introduced in the foundation slice.
- Future active prototypes must be tenant-gated and level-gated before student exposure.
