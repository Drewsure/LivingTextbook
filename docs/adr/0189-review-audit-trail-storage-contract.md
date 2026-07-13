# ADR 0189: Review Audit Trail Storage Contract

Date: 2026-07-13

## Status

Accepted

## Context

The review queue now shows preview-only audit trail events. Future live reviewer actions need durable history before those actions can support package state changes.

## Decision

Add `teacher-draft-review-audit` / `teacher_draft_review_audit` as a backend-neutral storage category.

The contract preserves audit events for handoff, reviewer decision, evidence, and approval-ledger steps. It blocks audit-driven state changes until reviewer identity, evidence, approval ledger, and release-control policy exist.

## Consequences

Future hosted and local implementations can build review workflow history without treating preview events, chat notes, or anonymous actions as approvals. Audit records remain separate from evidence files and package approval ledgers.
