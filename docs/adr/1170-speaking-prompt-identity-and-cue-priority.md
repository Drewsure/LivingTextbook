# ADR 1170: Speaking Prompt Identity And Cue Priority

## Status

Accepted

## Context

Speak It renders tenant-owned vocabulary and reviewed target sentences. A
prompt ID derived from learner text couples UI identity to content formatting.
Audio packages can also contain a generic unit cue and a cue reviewed for the
active game mode; first-match lookup makes that precedence accidental.

## Decision

Use deterministic positional IDs for term and sentence prompts. When matching
audio cues, prefer the active `speak-it` cue and then fall back to a generic
cue for the same reviewed text. Keep cue selection independent from
microphone approval, speech confirmation, scoring, mastery, persistence, and
AI Tutor services.

## Consequences

White-label punctuation and formatting variants cannot change prompt identity,
and audio delivery follows an explicit review priority. Missing or unavailable
assets still use the established target-language fallback; no recording or
provider dispatch is introduced by this adapter.

## Verification

Run `npm run verify:speaking-engine-runtime` and the complete
`npm run verify:foundation` suite.
