# ADR-0513: Audio-First Package Behavior Verification

Status: Accepted

## Context

Audio is required throughout the Living Textbook learner journey. A package can contain many audio cues and still be unsafe if a plan is missing, incomplete, or silently uses the support language in place of the target language.

## Decision

Make the target language explicit on every `UnitAudioSupportPlan`. Validate package references against that declaration, then validate the declaration against the runtime request before any future student-facing provider is selected.

The compiled foundation harness covers:

- a missing unit audio plan;
- wrong-language learner-facing cues;
- a runtime target-language mismatch;
- existing vocabulary and sentence coverage rules;
- review-only, side-effect-free package execution.

## Consequences

- Audio readiness is portable across hosted, local, hybrid, and future white-label deployments.
- Support-language audio remains useful without becoming progression authority.
- Real recording, storage, transcription, TTS, and media-provider work remains a later integration decision.
