# Build Session: Explicit Audio Scope

## Outcome

The shared audio coverage contract now enforces explicit game-mode scope for
every learner-facing cue kind. Cross-mode term, sentence, and instruction cues
cannot satisfy a route's readiness gate.

## Verification

- Web typecheck passes.
- Canonical game integration verification passes.
- Runtime behavior includes a cross-mode cue regression case.

## Boundary

No upload, live AI, persistence, assignment, or Phaser promotion was enabled.

## Follow-up hardening

The first full route gate exposed that the sample packages already declare
reviewed cross-mode cue reuse in `gameModeAudioCueIds`. The coverage helper now
consumes that plan: it authorizes listed reuse and requires only the cue
families used by the current mode. This preserved the explicit-scope rule
without over-blocking Memory Match or other vocabulary-only activities.

- Full 88-route verification passes after the plan is threaded through learner
  routes.
- Memory Match and vocabulary-first modes no longer demand unrelated sentence
  audio.
- Quiz, Sentence Builder, Fill in the Blank, and Speak It retain their planned
  sentence requirements.
