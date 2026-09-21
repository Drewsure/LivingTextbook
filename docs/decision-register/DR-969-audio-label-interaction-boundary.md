# DR-969: Audio Label Interaction Boundary

## Decision

Keep tap-to-speak prompt controls outside native form labels and connect text
entry fields to their prompt container with an explicit `aria-labelledby`
relationship.

## Required Invariants

- Type Answer retains a speakable instruction prompt.
- The text input has an explicit accessible name.
- No interactive audio control is nested inside the input label.
- Audio remains support behavior and cannot submit, score, persist, reward, or
  advance a round.

## Evidence

- `apps/web/src/features/game-shell/text-spelling/TypeAnswerPracticeGame.tsx`
- `scripts/verify-canonical-game-integrations.mjs`
