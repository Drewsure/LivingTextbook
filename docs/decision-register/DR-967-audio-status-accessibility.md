# DR-967: Audio Status Accessibility

## Decision

Expose a stable, polite status region for every shared audio control so the
learner can distinguish ready, playing, and unavailable states without relying
on visual text changes alone.

## Required Invariants

- The button references its status region with `aria-describedby`.
- Status updates are polite and atomic.
- Reviewed audio and speech fallback use the same status vocabulary.
- Audio status never owns scoring, persistence, rewards, or progression.

## Evidence

- `apps/web/src/features/audio/AudioCueButton.tsx`
- `scripts/verify-audio-accessibility.mjs`
