# ADR 0439: AI Verifier Submission Storage Guard

Status: Accepted

## Context

AI verifier submission packets now have a shared validator and require draft repair evidence. The next risk is treating a valid review packet as permission to run a live verifier or persist verifier state without policy-ready storage.

## Decision

Add a review-only AI verifier submission storage guard to tenant generator routes.

The guard uses the backend-neutral `teacher_draft_verifier_submission` record and shows hosted plus local companion adapter requirements. It keeps reviewer identity, evidence attachments, retention policy, audit trail, target-language audio approval, media-rights evidence, approval ledger, and release-control binding visible before live verification.

## Consequences

- The platform can discuss hosted and closed local deployment without choosing a backend too early.
- Verifier submission remains blocked until durable storage and evidence workflows exist.
- Package approval, route writes, playlist writes, assignments, and student-ready markers remain blocked.
- MiniStar support-language rules remain preserved at the storage boundary.

## Non-Goals

This does not implement storage writes, live verifier submission, package approval, route writes, playlist writes, assignments, student-ready state, or support-language progress.
