# FR-009: Core Speech Matching Practice

Status: Foundation slice started; standalone `Speak It` route exists.

## Requirement

Living Textbook must support speaking/listening games as a core game family before premium AI speech matching is introduced.

The core version should be usable in a teacher-led classroom, local/offline companion app, and standard tenant package without model calls or microphone capture.

## Current Foundation Implementation

The first implementation is a standalone `Speak It` route:

[http://127.0.0.1:3000/speak/demo-unit-1](http://127.0.0.1:3000/speak/demo-unit-1)

It supports:

- audio-led vocabulary prompts,
- audio-led target sentence prompts,
- student self-confirmation through `I said it`,
- standard progress events,
- Star Dust completion reward,
- no microphone prompt,
- no AI Tutor requirement.

## Future Speech Matching Upgrade

The premium upgrade may add:

- browser microphone capture,
- record/replay,
- local or cloud speech-to-text,
- expected-text matching,
- pronunciation or fluency feedback,
- teacher-visible speaking summaries.

These upgrades must remain optional and tenant-gated.

## Acceptance Criteria

- Core speaking practice remains available without AI Tutor.
- The premium speech layer can replace self-confirmation with speech matching later.
- The same event stream can report listened prompts, spoken confirmations, completion, and future speech-match outcomes.
- No raw audio or transcript storage is introduced before privacy and teacher/school rules are accepted.
