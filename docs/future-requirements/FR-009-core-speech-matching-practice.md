# FR-009: Core Speech Matching Practice

Status: Foundation slice expanded; standalone `Speak It` route includes local record/replay.

## Requirement

Living Textbook must support speaking/listening games as a core game family before premium AI speech matching is introduced.

The core version should be usable in a teacher-led classroom, local/offline companion app, and standard tenant package without model calls, transcript storage, cloud audio upload, or premium AI Tutor entitlement.

## Current Foundation Implementation

The current implementation is a standalone `Speak It` route:

[http://127.0.0.1:3000/speak/demo-unit-1](http://127.0.0.1:3000/speak/demo-unit-1)

It supports:

- audio-led vocabulary prompts,
- audio-led target sentence prompts,
- optional browser microphone record/replay,
- student self-confirmation through `I said it`,
- standard progress events,
- Star Dust completion reward,
- no microphone prompt until the learner taps `Record`,
- no transcript generation,
- no raw audio upload or persistence,
- no AI Tutor requirement.

## Future Speech Matching Upgrade

The premium upgrade may add:

- local or cloud speech-to-text,
- expected-text matching,
- pronunciation or fluency feedback,
- teacher-visible speaking summaries,
- optional raw audio review only if a school or tenant explicitly accepts privacy/storage rules.

These upgrades must remain optional, tenant-gated, teacher/school controlled, and replaceable.

## Acceptance Criteria

- Core speaking practice remains available without AI Tutor.
- Recording and replay support practice, but they do not complete mastery by themselves.
- The premium speech layer can replace self-confirmation with speech matching later.
- The same event stream can report listened prompts, local microphone practice, spoken confirmations, completion, and future speech-match outcomes.
- No raw audio or transcript storage is introduced before privacy and teacher/school rules are accepted.
