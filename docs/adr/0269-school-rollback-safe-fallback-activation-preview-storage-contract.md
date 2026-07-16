# ADR 0269: School Rollback Safe Fallback Activation Preview Storage Contract

## Status

Accepted.

## Context

The future safe fallback activation preview names the fields required before any activation workflow can ever be designed. Hosted and closed/local deployments need a shared storage vocabulary for this preview without creating a live activation path.

## Decision

Add `school_rollback_safe_fallback_activation_preview` / `school-rollback-safe-fallback-activation-preview` as a backend-neutral storage contract.

The contract preserves minimum activation fields, non-activated markers, blocked actions, and review rules. Hosted and local write intents are policy-required and must keep fallback activation, release-state mutation, production QR redirect mutation, live notifications, classroom shutdown, report export, media replacement, local bundle deactivation, and student reassignment blocked.

## Consequences

- Future activation field shape can become durable without creating an activation workflow.
- Hosted and local deployments share one storage shape.
- Route pause, local fallback, media fallback, report, and assignment behavior remain blocked until future policy and implementation gates exist.
