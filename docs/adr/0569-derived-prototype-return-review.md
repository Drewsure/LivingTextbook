# ADR 0569: Derived Prototype Return Review

Status: Accepted

## Decision

Derive the returned-package readiness status and Codex return-review label from
the evidence lanes through the shared content model.

The state rules are:

- any missing source, fixture, audio, mobile, or scoring evidence keeps return
  review `not-ready`;
- when no evidence is missing, a blocked lane produces
  `evidence-review-needed`;
- only an all-ready lane set produces `ready-for-codex-return-review`;
- the visible review label is derived from the same status.

## Context

The returned-package summary had a hand-maintained status and review label.
That could make the workbench disagree with the evidence lanes and would make
it too easy for a preview to appear closer to review than it really was.

## Consequences

- Missing returned-package evidence remains visibly unopened.
- Structural blockers become a distinct evidence-review state after missing
  evidence is resolved.
- The teacher workbench, runtime harness, and future Codex handoff share one
  state machine.
- No archive import, app write, route replacement, scoring mutation, reward
  write, playlist write, package promotion, assignment, or support-language
  progress is enabled.

## Verification

Runtime tests cover missing, blocked, and all-ready lane sets plus the three
review labels. Web typecheck, production build, prototype review, and active
route checks remain required before this slice is pushed.
