# ADR 0187: Review Evidence Storage Contract

Date: 2026-07-13

## Status

Accepted

## Context

The review queue now shows blocked evidence packet requirements. Future upload or signature capture needs durable evidence metadata before any files or proof can be attached.

## Decision

Add `teacher-draft-review-evidence` / `teacher_draft_review_evidence` as a backend-neutral storage category.

The contract preserves evidence packet metadata and blocks uploads until reviewer identity, storage, retention, rights, and approval policy exist.

## Consequences

Future hosted and local implementations can add evidence upload or signature capture without storing raw learner audio, transcripts, anonymous proof, or chat-only approval claims in core records.
