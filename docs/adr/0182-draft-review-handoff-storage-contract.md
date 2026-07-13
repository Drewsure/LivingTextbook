# ADR 0182: Draft Review Handoff Storage Contract

Date: 2026-07-13

## Status

Accepted

## Context

The teacher draft page now shows a read-only review handoff packet, but a future submit-for-review workflow needs durable hosted and local storage rules before any live submission can exist.

## Decision

Add `teacher-draft-review-handoff` / `teacher_draft_review_handoff` as a backend-neutral storage category.

The contract preserves schema validation, source lineage, audio coverage, rights/version, route/activity, and approval packet sections while blocking live review submission and student assignment.

## Consequences

Future hosted or local implementations can build submit-for-review from a fixed packet vocabulary without choosing a backend vendor now or bypassing verifier and approval gates later.
