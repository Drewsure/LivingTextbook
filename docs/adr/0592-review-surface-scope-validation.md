# ADR 0592: Review-Surface Scope Validation

Status: Accepted

## Decision

Validate every evidence-flow and prototype-storage scope value against the shared `platform` or `tenant` contract before a review panel relies on it.

## Context

Explicit scope labels prevent ambiguity only if malformed values cannot pass through. The platform/tenant distinction is part of the white-label safety boundary, not merely presentation text.

## Consequences

- Invalid or future ad-hoc scope values are rejected visibly.
- Platform contracts and tenant records remain distinguishable in data, panels, and runtime checks.
- The validator is small, provider-neutral, and does not authorize live writes.

## Verification

Runtime behavior must cover valid and invalid scope values. Prototype-review verification, web typecheck, full foundation verification, production build, and active route checks remain required.
