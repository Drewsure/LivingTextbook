# ADR 0801: Audio Transcript Match Guard

- Status: accepted
- Date: 2026-09-15
- Scope: learner-facing audio controls across canonical game engines

## Context

Canonical game modes can use one reviewed feedback cue for a specific state,
while the visible message changes for retry, success, next-round, and completion
states. Passing a generic cue into every state risks playing the wrong recording
for the text a child sees.

## Decision

The shared `AudioCueText` and `AudioCueButton` primitives compare normalized
visible text and cue text before using `sourceUri`. Exact matches may play the
reviewed asset. Mismatches use target-language speech fallback for the exact
visible text. The primitive exposes the effective source through
`data-audio-source` for browser verification.

## Consequences

- Reviewed recordings remain semantically trustworthy.
- Tenants can provide selective recorded coverage without blocking every state.
- Browser speech remains a controlled fallback, never a substitute for review
  metadata or a new scoring path.
- The guard is shared by DOM games and must be preserved by future Phaser
  adapters.

## Verification

```text
npm run verify:canonical-games
npm run typecheck --workspace @living-textbook/web
npm run verify:foundation
```
