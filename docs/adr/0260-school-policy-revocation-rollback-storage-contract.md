# 0260 School Policy Revocation Rollback Storage Contract

Status: accepted
Date: 2026-07-16

## Context

The school policy revocation and rollback preview names the exit-path rules required before school acceptance can affect launch readiness. That preview must be preserved in hosted and local backend planning without becoming a revocation action, rollback button, release mutation, production QR change, learner-data deletion, report export, media replacement, local bundle deactivation, premium entitlement change, or live classroom shutdown.

## Decision

Add backend-neutral storage contracts for `school_policy_revocation_rollback_preview` / `school-policy-revocation-rollback-preview`.

The contract preserves revocation authority, release rollback scope, printed QR effect, learner-data/report effect, media/local package effect, premium feature effect, minimum rollback record fields, blocked actions, and review rules in the schema draft, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries.

## Consequences

- Hosted and local implementations share one school rollback vocabulary.
- Future acceptance work must prove a matching revocation/rollback contract exists before affecting launch readiness.
- No revocation action, rollback button, release-state mutation, production QR redirect mutation, learner-data deletion workflow, report export, media replacement, local bundle deactivation, AI Tutor entitlement change, or live classroom shutdown workflow is enabled.
