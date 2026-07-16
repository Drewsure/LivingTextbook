# ADR 0267: School Rollback Safe Fallback Preflight Storage Contract

## Status

Accepted.

## Context

The safe fallback preflight lists what must be reviewed before fallback copy, printed QR pause behavior, local companion fallback, media playlist pause, assignment changes, or report behavior can ever move beyond review-only planning.

Hosted and closed/local deployments need the same durable record vocabulary before any activation workflow is designed.

## Decision

Add `school_rollback_safe_fallback_preflight` / `school-rollback-safe-fallback-preflight` as a backend-neutral storage contract.

The contract preserves preflight lanes, minimum activation fields, blocked actions, and preflight rules. Hosted and local write intents are policy-required and must keep fallback activation, release-state mutation, production QR redirect mutation, live notifications, classroom shutdown, report export, media replacement, local bundle deactivation, and student reassignment blocked.

## Consequences

- Safe fallback activation readiness can become durable without becoming an activation switch.
- Hosted and local deployments share one storage shape.
- Future rollback, route pause, local companion, media, report, and assignment work has a checked policy surface before implementation.
