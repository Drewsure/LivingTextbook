# 0256 School Policy Text Pack Storage Contract

Status: accepted
Date: 2026-07-16

## Context

The school policy text version pack makes exact policy clause areas visible before a school can ever accept terms. That visibility must survive future backend work, hosted storage work, and local package work without becoming a live acceptance or launch workflow.

## Decision

Add backend-neutral storage contracts for `school_policy_text_pack` / `school-policy-text-pack`.

The contract preserves policy text versions, clause versions, minimum version fields, blocked actions, and review rules in the schema draft, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries.

## Consequences

- Hosted and local implementations have the same product rule for school policy text packs.
- Future school acceptance work must reference a versioned text pack instead of free-form meeting notes.
- No policy acceptance, accept button, signed approval capture, evidence export, storage activation, launch-ready status, production QR promise, AI Tutor activation, support-language-only progression, real learner data collection, report export, or live classroom workflow is enabled.
