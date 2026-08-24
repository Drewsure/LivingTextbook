# ADR 0432: Prototype Return Readiness Summary

## Status

Accepted.

## Context

Returned outside-game packages can be detailed but still not ready for Codex return review. The platform needs a compact state summary so a teacher, reviewer, or future agent can see whether return evidence is visible, missing, or blocked without confusing evidence capture with integration approval.

## Decision

Add a prototype return readiness summary to the game-readiness and tenant prototype review workbenches. The summary separates return checklist visibility, return storage guard visibility, source archive manifest evidence, fixture replay, audio/mobile/scoring proof, and Codex return review status.

## Consequences

- Returned outside-game work remains review-only and not-ready by default.
- Codex return review stays blocked until evidence lanes are complete.
- The summary gives Z.ai/outside build management a clear next-state view without enabling imports, app file copies, route replacement, scoring mutation, rewards, playlists, package promotion, or student assignment.
- Route and prototype-review verifiers must protect the visible summary markers.
