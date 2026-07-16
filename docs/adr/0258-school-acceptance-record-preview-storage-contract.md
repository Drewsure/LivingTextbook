# 0258 School Acceptance Record Preview Storage Contract

Status: accepted
Date: 2026-07-16

## Context

The future school acceptance record preview names the minimum fields a future authenticated school acceptance record would need. That preview must be preserved in hosted and local backend planning without becoming accepted terms, signature capture, evidence export, storage activation, or launch readiness.

## Decision

Add backend-neutral storage contracts for `school_policy_acceptance_record_preview` / `school-policy-acceptance-record-preview`.

The contract preserves minimum accepted-record fields, non-accepted markers, blocked actions, and review rules in the schema draft, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries.

## Consequences

- Hosted and local implementations have the same product rule for school acceptance record previews.
- Future accepted-terms work must reference a blocked preview record shape before implementation.
- No accepted terms are stored, no signatures are captured, no evidence is exported, no storage is activated, no launch-ready status is created, no production QR promise is made, no AI Tutor is activated, no learner data is collected, no reports are exported, and no live classroom workflow is enabled.
