# ADR 0795: Reviewed Asset Audio Playback

## Status

Accepted for the foundation slice.

## Context

`AudioCue` already carries optional reviewed asset references, but the shared
learner control used browser speech synthesis for every cue. That made the
multimedia contract incomplete: partner-provided or teacher-reviewed audio
could be present in a package without being used by the learner control.

## Decision

The shared audio primitive prefers a cue `sourceUri` for playback. If the
asset is absent, cannot load, or cannot play in the browser, it falls back to
speech synthesis using the cue text and language. Current web routes do not
interpret `localBundlePath`; a future local companion adapter must resolve
that path explicitly.

Canonical game controls pass their already-authorized cue into the primitive
when they have one. Playback remains presentation-only and cannot alter
events, scoring, mastery, Star Dust, unlocks, support-language rules, or
teacher reports.

## Consequences

- Reviewed recordings can be used without changing game components again.
- Browser speech keeps the demo and low-cost white-label path resilient.
- Real media still requires normal tenant, rights, scan, release, and storage
  gates before it becomes student-facing.
- A browser route never treats a local filesystem path as a web URL.

## Verification

Run `npm run verify:canonical-games`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation` after the slice is complete.
