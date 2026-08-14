# DR-426: AI Prototype Audio Coverage Report Validator

Date: 2026-08-14  
Status: Accepted

## Decision

AI prototype audio coverage reports must use a shared content-model validator before scoring replay, mobile accessibility inspection, Codex integration decisions, app patch planning, route planning, package promotion, assignment, playlist writes, or audio-complete markers can be considered.

## Rationale

Audio is a foundation requirement for the LivingTextbook platform. Young learners and multilingual learners must be able to tap or replay target-language text, and support-language audio must remain support-only. A shared guard keeps returned prototypes from treating audio as polish, generating voice calls, creating voice API cost, or letting media/support audio affect mastery.

## Required Evidence

- Prototype audio coverage, event replay, fixture replay, AI audio coverage plan, audio cue manifest, package game audio coverage, and background media policy lineage.
- Required cue families for term, sentence, instruction, feedback, and critical control audio.
- Target-language checks for vocabulary, sentence, instruction, feedback, and speech-matching prompt replay.
- Control audio checks proving visible text, age-appropriate listen/replay paths, and no color-only critical state.
- Support-language rules proving support cues cannot emit mastery and background media yields to learning audio.
- Replay evidence for tap-to-speak coverage, audio cue manifest references, `audio_requested` logs, missing cue lists, control audits, and background media conflicts.

## Hard Boundaries

- No audio manifest mutation from prototype.
- No generated voice call.
- No voice API cost.
- No media-only mastery.
- No support-language progress trigger.
- No playlist write.
- No package audio-complete marker.
- No student assignment.
