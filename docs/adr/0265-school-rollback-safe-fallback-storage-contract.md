# ADR 0265: School Rollback Safe Fallback Storage Contract

## Status

Accepted.

## Context

The safe fallback plan previews child-safe pause copy and route fallback responsibilities. Hosted and closed/local deployments need the same durable record vocabulary before printed QR pause, local fallback, media playlist pause, teacher handoff, or school support workflows are designed.

## Decision

Add `school_rollback_safe_fallback_plan` / `school-rollback-safe-fallback-plan` as a backend-neutral storage contract.

The contract preserves message drafts, route fallbacks, blocked actions, and fallback rules. Hosted and local write intents are policy-required and must keep production QR redirect mutation, live notifications, classroom shutdown, report export, media replacement, local bundle deactivation, and student reassignment blocked.

## Consequences

- Safe fallback wording can become durable without becoming a live notification or redirect system.
- Hosted and local deployments share one storage shape.
- Future printed QR, local package, and media fallback work has reviewed copy and policy gates before implementation.
