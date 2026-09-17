# ADR 0820: Memory Match Evidence Handoff Packet

Status: Accepted for evidence preparation

## Context

The frozen MiniStar Phaser source contains a promising Memory Match candidate,
but it is not yet a platform-compatible game. The canonical Living Textbook
wrapper and contracts must remain the owners of content, audio, scoring,
progression, persistence, rewards, and assignments.

## Decision

Prepare one human-triggered evidence handoff packet before requesting any Z.ai
implementation work. The packet binds the frozen candidate provenance and
specifies nine required return artifacts:

1. Return-package manifest.
2. Reviewed unit fixture.
3. Canonical event replay.
4. Target-language audio coverage report.
5. Deterministic scoring replay.
6. Mobile and accessibility report.
7. Wrapper adapter review.
8. Source SHA-256 manifest.
9. Setup and known-limitations README.

The teacher surface may preview this packet, but it cannot dispatch an agent or
approve integration. The candidate remains quarantined until Codex reviews the
returned evidence and records a new decision.

## Consequences

The next Z.ai request is precise, auditable, and inexpensive to evaluate. The
tradeoff is that no Phaser code is promoted during this slice. This preserves
the canonical route and prevents duplicate state owners while the candidate is
being assessed.

## Revisit trigger

Revisit only when the complete return package is available and all acceptance
checks pass against the frozen source binding.
