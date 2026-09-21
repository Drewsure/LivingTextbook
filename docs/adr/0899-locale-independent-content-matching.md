# ADR 0899: Locale-Independent Content Matching

## Status

Accepted

## Decision

Canonical text normalization for vocabulary, audio-cue matching, and browser
evidence fingerprints must use locale-independent casing and ordinal key
ordering. User or browser locale must not change whether reviewed content
matches or whether an event fingerprint is stable.

## Consequences

- Audio coverage and duplicate-term validation remain stable across tenant
  languages and operating-system locales.
- Browser rehearsal evidence has the same fingerprint on different machines.
- Locale-sensitive display formatting remains allowed at the presentation
  boundary; it must not be used for identity, matching, or evidence keys.

## Verification

Run the audio accessibility verifier, content-model/runtime checks, web and
AI-service typechecks, production build, and the full foundation gate.
