# ADR 1178: Gloss-Bound Assist-Language Audio Coverage

## Status

Accepted for foundation scaffolding; audio catalog admission remains gated.

## Decision

Assist-language audio coverage is calculated from the reviewed unit glosses,
not from a raw count of audio files. The shared content-model contract reports
required and covered terms, sentences, and instructions, the exact missing
source items, the scoped cue count, and a derived readiness flag.

The contract is evidence-only. It does not generate speech, call an external
service, upload audio, approve rights, write a package, or make support audio a
progression or mastery signal.

## Rationale

Young learners need audio support, and support-language audio must be held to
the same inspectable standard as target-language audio. A raw cue count can
look complete while omitting a sentence or instruction. Gloss-bound matching
makes the gap visible and remains portable across white-label tenants and
offline packages.

## Consequences

- Teacher review shows exact missing support-language audio coverage.
- MiniStar Japanese text can remain reviewed while its absent recorded audio is
  clearly open work.
- Future recorded, teacher-provided, partner-provided, or approved TTS assets
  can be admitted against the same contract.
- The actual catalog still needs asset rights, transcript, provenance, and
  package-release evidence before production use.

## Evidence

- `packages/content-model/src/assistLanguageAudioCoverage.ts`
- `apps/web/src/data/sampleAssistLanguageReview.ts`
- `scripts/verify-assist-language-audio-coverage.mjs`
