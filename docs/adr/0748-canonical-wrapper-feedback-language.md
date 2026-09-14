# ADR 0748: Canonical Wrapper Feedback-Language Alignment

## Status

Accepted

## Context

The Match Up wrapper correctly emitted audio-requested events using the
resolved target language, but its visible feedback and replay controls could
fall back to English when a cue did not provide a language. That created a
split learner experience: the evidence event was localized while the
interactive control could speak the wrong language.

## Decision

Canonical wrapper feedback and replay controls must resolve missing cue
language from the tenant/unit target language before using the English
platform baseline. The Match Up wrapper now follows this rule, and the
canonical integration verifier guards the specific fallback boundary.

## Consequences

Target-language behavior remains consistent across instructions, feedback,
replay controls, and completion evidence. Missing reviewed audio is still a
content-quality issue; this fallback only prevents an accidental English
language claim for another tenant.

## Verification

Run `npm run verify:canonical-games`, workspace typecheck, production build,
and the active route verifier.
