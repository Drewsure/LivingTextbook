# 0261 School Rollback Storage Handoff Preview

Status: accepted
Date: 2026-07-16

## Context

The revocation and rollback storage contract now exists in the backend-neutral schema, migration plans, adapter plans, durable records, and verifiers. School, publisher, and platform reviewers still need to see that storage boundary in the read-only review surface without opening backend files.

## Decision

Show a `Storage contract handoff` block inside the school policy revocation and rollback preview.

The block exposes the schema entity id, category id, durable record id, primary key, hosted write intent, local write intent, and count of blocked live actions. It remains informational only.

## Consequences

- Reviewers can connect the visible school rollback preview to the durable storage contract.
- Hosted and local deployment planning stays explicit in the UI.
- No revocation action, rollback button, release-state mutation, production QR redirect mutation, learner-data deletion, report export, media replacement, local bundle deactivation, AI Tutor entitlement change, or live classroom shutdown workflow is enabled.
