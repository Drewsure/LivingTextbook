# ADR 0191: Verifier Submission Storage Contract

Date: 2026-07-13

## Status

Accepted

## Context

The review queue now shows a preview-only verifier submission preflight. A future live verifier workflow needs durable preflight records before any draft can leave review preview.

## Decision

Add `teacher-draft-verifier-submission` / `teacher_draft_verifier_submission` as a backend-neutral storage category.

The contract preserves schema, audio, support-language, route, evidence, audit, and approval preflight checks. It blocks automatic verifier submission until workflow, identity, evidence, and approval policy exist.

## Consequences

Future hosted and local implementations can add submit-to-verifier workflows without relying on UI state or chat records. Preflight records remain gates, not approvals, package releases, or student assignments.
