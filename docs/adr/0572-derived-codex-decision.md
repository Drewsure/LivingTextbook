# ADR 0572: Derived Codex Decision

Status: Accepted

## Decision

Derive the Codex integration-decision status from its review checks.

The state rules are:

- missing or blocked checks produce `blocked`;
- pending checks produce `review-only`;
- all-reviewed checks produce `ready-for-review`;
- `ready-for-review` is a handoff to manual Codex review, not an approval.

## Context

The decision record already stored wrapper, fixture, event, audio, mobile,
scoring, and readiness-gate checks, but its status was independently set to
blocked. That duplicated state and could drift from the evidence being shown.

## Consequences

- Codex sees an accurate evidence-derived review state.
- A future ready-for-review record still requires a human decision and keeps
  `selectedDecision` unset until that decision is actually recorded.
- Tenant and support-language guardrails remain part of the decision record.
- No app patch, route mutation, scoring/reward write, playlist write, package
  promotion, or assignment is enabled.

## Verification

Runtime tests cover empty, pending, and all-reviewed check sets. The web
typecheck, production build, prototype review, and active route checks remain
required before this slice is pushed.
