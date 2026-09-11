# ADR 0568: Derived Prototype Readiness Summary

Status: Accepted

## Decision

Derive the prototype intake summary status and visible Codex-alert label from
the summary's readiness lanes through the shared content model.

The state rules are:

- any missing lane keeps the summary `not-ready`;
- when no evidence is missing, a blocked lane produces `evidence-review-needed`;
- only an all-ready lane set produces `ready-for-codex-alert`;
- the visible alert label is derived from the same alert decision used by the
  handoff signal.

## Context

The previous summary stored its overall status and Codex-alert label as
independent strings. That allowed the UI to drift from the lane evidence. The
alert itself had already been centralized, so the summary needed to use the
same source of truth.

## Consequences

- The review workbench, runtime harness, and future handoff surface share one
  state machine.
- A structurally valid preview remains not-ready while a real returned package
  and replay evidence are missing.
- Structural problems become evidence-review-needed once missing evidence has
  been resolved, instead of being softened into an ordinary missing-work
  message.
- No import, route, scoring, reward, media, package, assignment, or storage
  side effect is enabled by this derivation.

## Verification

Runtime tests cover missing, blocked, and all-ready lane sets plus their alert
labels. Web typecheck, production build, prototype review, and active route
checks remain required before this slice is pushed.
