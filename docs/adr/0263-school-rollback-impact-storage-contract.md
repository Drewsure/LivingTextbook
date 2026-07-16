# ADR 0263: School Rollback Impact Storage Contract

## Status

Accepted.

## Context

The rollback impact matrix names the records and evidence affected by a future school rollback. Hosted and closed/local deployments need the same storage vocabulary before any implementation chooses a backend or local store.

## Decision

Add `school_policy_rollback_impact_matrix` / `school-policy-rollback-impact-matrix` as a backend-neutral storage contract.

The contract preserves impact rows, affected records, required evidence, blocked actions, and matrix rules. Hosted and local write intents are policy-required and must keep release-state mutation, production QR redirect mutation, learner-data deletion, report export, media replacement, local bundle deactivation, AI Tutor entitlement changes, and live classroom shutdown workflows blocked.

## Consequences

- The rollback impact matrix can become durable without becoming a live rollback workflow.
- Hosted and local deployments share one storage shape.
- Future backend decisions can compare vendors against the same policy and evidence requirements.
