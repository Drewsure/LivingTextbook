# DR-076: Teacher Session Game Audio Preflight

## Decision

Show assigned game audio coverage in teacher session preflight.

## Rationale

Package-level gates block pilot release when assigned game modes lack reviewed audio coverage. Teachers also need this visible at launch-session level, before treating a classroom session as pilot-ready.

## Consequences

- Session preflight compares assigned game modes with audio-covered modes in the package support plan.
- Missing game audio coverage warns before pilot use.
- The check remains vendor-neutral and does not store raw audio, learner recordings, or transcripts.

## Non-Goals

- New backend writes.
- Raw audio storage.
- Automatic audio generation.
- Premium polish.
