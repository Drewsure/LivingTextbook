# ADR 0185: Reviewer Decision Storage Contract

Date: 2026-07-13

## Status

Accepted

## Context

The review queue now shows disabled reviewer decision outcomes. Future live decisions need a durable audit shape before any decision can affect package workflow state.

## Decision

Add `teacher-draft-review-decision` / `teacher_draft_review_decision` as a backend-neutral storage category.

The contract preserves reviewer identity, evidence requirements, attached evidence, blockers, outcome labels, and state-change blocks.

## Consequences

Future hosted and local implementations can add live return-for-edits, needs-audio, and ready-for-approval workflows without allowing anonymous approval, evidence-free state changes, direct AI publish, or student assignment bypass.
