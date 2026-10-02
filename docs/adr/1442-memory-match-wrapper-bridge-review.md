# ADR 1442: Memory Match Wrapper Bridge Review

## Status

Accepted as a review-only foundation slice. Wrapper approval remains blocked.

## Decision

The returned Z.ai Memory Match evidence package is admitted into a platform-owned wrapper bridge record, not into the active game route. The bridge compares the external evidence with the canonical `PairingMemoryMatchGame` contract and records normalization work explicitly.

The active route remains `apps/web/src/app/memory/[code]/page.tsx`, and the active implementation remains `PairingMemoryMatchGame.tsx`. The external Phaser source remains isolated outside the repository’s active app surfaces.

## Evidence outcome

The package is hash-verified and frozen-source-bound. Its fixture has eight terms, two target sentences, pairing mode, and an English audio map. It is not yet admissible for a wrapper proposal because the returned replay names `memory-match-v1` instead of `pairing-reinforcement-v1`, does not carry the canonical parent-engine metadata on completion evidence, and documents keyboard, focus, and reduced-motion gaps.

## Boundaries

- The bridge is evidence and normalization planning only.
- The platform owns route state, scoring, mastery, Star Dust, rewards, persistence, reporting, audio manifests, and tenant configuration.
- No source import, route replacement, package promotion, QR activation, or student assignment is enabled.
- A future wrapper proposal requires a new Codex decision after corrected replay and accessibility evidence.
