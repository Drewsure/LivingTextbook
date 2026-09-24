# ADR 1184: Assist-Language Audio Composite Release-Review Binding

## Status

Accepted for foundation scaffolding; production approval remains blocked.

## Decision

Create one provider-neutral binding that carries assist-language audio
reconciliation, reviewer identity/signature gate, white-label release
readiness, package publish gate, approval ledger, and controlled human-review
packet identities. The media library exposes the composite scope and blockers
without creating a release action.

## Boundaries

- Every identity must remain tenant- and package-scoped.
- Scope drift is visible and blocks the binding.
- Approval capture, production approval, package promotion, student production
  launch, catalog admission, student-facing assist audio, and persistence
  side effects remain disabled.
- The binding does not authenticate a reviewer, freeze a packet, or mutate
  release state.

## Verification

`verify:assist-language-audio-catalog-release-review-binding` validates
composite record linkage, deterministic identity, tenant scope, blocked actions,
route exposure, and review-only behavior.
