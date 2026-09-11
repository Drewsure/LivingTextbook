# ADR 0590: Return Evidence Lane Completeness

Status: Accepted

## Decision

Derive the prototype-return “audio, mobile, and scoring proof” lane only when every required evidence category is present as a ready preview for every checklist in the tenant scope. Audio alone is insufficient.

## Context

Returned game packages must preserve learning-audio priority, mobile accessibility, and parent-engine event/scoring ownership. Treating one audio record as proof of the whole lane could allow an incomplete return packet to appear ready for review.

## Consequences

- A return packet must show audio, mobile/accessibility, and event/scoring evidence together.
- Missing one category keeps the lane missing and keeps Codex return review closed.
- The rule is tenant-scoped and works across DOM and Phaser candidates.

## Verification

Web typecheck, prototype-review verification, full foundation verification, production build, and active route checks remain required.
