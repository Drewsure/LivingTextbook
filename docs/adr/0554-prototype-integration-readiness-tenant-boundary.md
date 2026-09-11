# ADR 0554: Prototype Integration Readiness Tenant Boundary

Status: Accepted

## Context

The LivingTextbook platform keeps Z.ai, Phaser, and other outside game work in review-only evidence packets until Codex integration review is complete. The integration-readiness gate is already required to preserve wrapper, fixture, event, audio, accessibility, scoring, and Codex decision evidence.

The gate is also white-label metadata. Without an explicit tenant-boundary requirement in its durable record and adapter contracts, a future hosted or local provider could store or replay a valid readiness decision under the wrong publisher.

## Decision

Require `preservesTenantBoundary: true` on every `ai-prototype-integration-readiness-gate` and `codex-integration-review-decision` durable record and hosted/local persistence write intent.

## Consequences

- External prototype evidence and its Codex decision remain scoped to the tenant that requested review.
- Hosted and local deployments share the same isolation rule.
- The rule is inexpensive to verify before a backend exists.
- No import, route write, app patch, scoring change, package promotion, or student assignment is enabled.

## Verification

- Shared persistence validators reject a readiness-gate record or intent without tenant-boundary preservation.
- Runtime verification covers both rejection paths.
- Backend storage verification checks the sample hosted/local contracts and source markers.
