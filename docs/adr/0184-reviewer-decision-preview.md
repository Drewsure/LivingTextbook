# ADR 0184: Reviewer Decision Preview

Date: 2026-07-13

## Status

Accepted

## Context

The teacher draft review queue shows handoff packets and blockers, but reviewers also need to understand likely future outcomes before live workflow implementation.

## Decision

Add reviewer decision previews to `/teacher/review`.

The preview shows `Return for edits`, `Needs audio`, and `Ready for approval` as disabled future outcomes. None of these decisions can submit, approve, publish, assign, or change package state.

## Consequences

The product can explain the review workflow while preserving the foundation rule that reviewer identity, evidence storage, verifier workflow, package approval, and release-control policy must exist before live decisions.
