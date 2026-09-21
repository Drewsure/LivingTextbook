# DR-965: Memory Match Accessibility State

## Decision

The canonical Memory Match wrapper exposes card state through `aria-pressed`
and exposes changing learner feedback through a polite live region.

## Required Invariants

- Hidden, selected, mismatched, and matched states remain understandable
  without relying on color or animation.
- Keyboard activation uses the same pairing engine path as pointer activation.
- The accessibility layer does not own scoring, persistence, rewards, or
  progression.

## Evidence

- `apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx`
- `scripts/verify-canonical-game-integrations.mjs`
