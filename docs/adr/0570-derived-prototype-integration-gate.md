# ADR 0570: Derived Prototype Integration Gate

Status: Accepted

## Decision

Derive the AI prototype integration-readiness gate status from its evidence
checks.

The state rules are:

- missing or blocked evidence produces `blocked`;
- pending evidence produces `review-only`;
- an all-reviewed evidence set produces `ready-for-codex-review`;
- the last state means the packet is ready for Codex review, not that any app
  patch or integration action is authorized.

## Context

The integration gate already represented wrapper, fixture, event, audio,
mobile, scoring, and Codex-decision evidence, but its sample status was
hand-maintained. A stale status could make an evidence packet look ready or
blocked independently of the checks it summarized.

## Consequences

- The gate, UI, and runtime harness share one evidence-driven state machine.
- Z.ai and Phaser work remains quarantined until the required evidence is
  actually returned and reviewed.
- A future ready-for-review signal remains a Codex handoff point, not an
  automatic import or merge.
- App writes, route writes, scoring/reward changes, playlist writes, package
  promotion, and student assignment remain blocked.

## Verification

Runtime tests cover empty, pending, and all-reviewed check sets. Typecheck,
production build, active route checks, and prototype review checks remain
required before this slice is pushed.
