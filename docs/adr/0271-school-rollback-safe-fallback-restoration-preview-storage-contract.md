# ADR 0271: School Rollback Safe Fallback Restoration Preview Storage Contract

## Status

Accepted.

## Context

The future safe fallback restoration preview names the fields required before any restoration workflow can ever be designed. Hosted and closed/local deployments need a shared storage vocabulary for this preview without creating a route restore, local package restore, media restore, report export, or classroom restart path.

## Decision

Add `school_rollback_safe_fallback_restoration_preview` / `school-rollback-safe-fallback-restoration-preview` as a backend-neutral storage contract.

The contract preserves minimum restoration fields, non-restored markers, blocked actions, and review rules. Hosted and local write intents are policy-required and must keep restoration activation, release-state mutation, production QR redirect mutation, live notifications, classroom restart, report export, media restoration, local bundle restoration, and student reassignment blocked.

## Consequences

- Future restoration field shape can become durable without creating a restoration workflow.
- Hosted and local deployments share one storage shape.
- Route restoration, local package restoration, media restoration, report, and assignment behavior remain blocked until future policy and implementation gates exist.
