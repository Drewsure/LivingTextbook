# ADR 0769: Speaking Engine Runtime Contract

## Status

Accepted

## Context

Speak It is a speaking/listening skin over the Selection parent engine. It
must support tap-to-hear prompts for young learners, preserve reviewed target
language text, and optionally expose teacher-approved local microphone replay.
The prompt assembly previously lived inside the visual component without a
direct runtime contract.

## Decision

Move speaking prompt assembly into a pure adapter and require runtime evidence
for deterministic term and sentence prompt order, stable identities, reviewed
text preservation, and case/whitespace-safe audio-cue matching. Microphone
capture remains optional, teacher-controlled, local replay by default, and
separate from core completion.

## Consequences

Speaking skins share one auditable prompt/audio boundary and cannot invent
content or require a paid speech service for core progression. This does not
authorize AI speech scoring, persistence, or Phaser source promotion.

## Verification

Run `npm run verify:speaking-engine-runtime` and the complete
`npm run verify:foundation` suite.
