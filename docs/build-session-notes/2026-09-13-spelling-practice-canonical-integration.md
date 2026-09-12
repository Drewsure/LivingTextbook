# Build Session: Spelling Practice Canonical Integration

## Completed

- Promoted the deterministic Spelling Practice slice into the canonical
  integration verifier.
- Added deterministic replay identity to start, round, answer, mastery, and
  completion evidence.
- Added target-language-aware tap-to-speak coverage for instructions, prompts,
  letter tiles, answer guidance, feedback, and replay.
- Added the playable-slice document, ADR, and decision-register entry.

## Verification

- Targeted canonical integration verification must pass for eight slices.
- Full foundation verification is required before this slice is considered
  complete.

## Human Intervention

- No human action is required for local verification.
- GitHub push remains subject to the existing Windows credential/session
  blocker; the user can run the documented push command after re-authentication.
