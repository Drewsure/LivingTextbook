# ADR 0580: Prototype Intake Alert Readiness Alignment

Status: Accepted

## Decision

The Z.ai prototype intake alert status must be validated against the authoritative prototype-intake readiness lanes. A structurally valid alert is insufficient if its displayed status disagrees with the derived readiness decision.

## Context

The alert is deliberately review-only while returned prototype packages and replay evidence are missing. The readiness summary is the source of truth for whether the human handoff signal may be issued. Without an alignment check, a future edit could display a ready signal while the readiness lanes still contain missing or blocked evidence.

## Consequences

- The user-facing handoff state cannot drift from the readiness workbench.
- Missing returned packages continue to produce a not-ready alert.
- A returned package does not become eligible merely by changing the alert payload.
- The guard remains provider-neutral and does not authorize import, route creation, or student use.

## Verification

The runtime harness must test both aligned and deliberately mismatched alert states. Prototype-review verification, typecheck, full foundation verification, production build, and active route checks remain required.
