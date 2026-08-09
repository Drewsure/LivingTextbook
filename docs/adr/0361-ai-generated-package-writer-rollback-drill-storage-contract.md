# ADR 0361: AI Generated Package Writer Rollback Drill Storage Contract

Date: 2026-08-09

## Status

Accepted

## Context

Generator routes now expose review-only package writer rollback drills. Those drills are useful only if hosted and closed-local deployments can preserve the same restore evidence without enabling rollback execution.

## Decision

Add a backend-neutral `ai_generated_package_writer_rollback_drill` schema contract and matching `ai-generated-package-writer-rollback-drill` durable record category.

Hosted and local adapters must preserve writer preflight links, pre-write snapshots, post-write verification, rollback rehearsal steps, required records, blocked rollback actions, and support-language boundaries. They must block rollback execution, package writer execution, package JSON rollback, route rollback, media playlist rollback, local bundle rollback, assignment mutation, production QR redirect mutation, student-ready markers, and support-language-only rollback evidence.

## Consequences

- Future generated package writer work has a durable restore-evidence contract before implementation.
- Closed local companion deployments and hosted deployments share the same rollback-drill vocabulary.
- This does not create rollback buttons, writer execution, route mutation, assignment mutation, or production QR redirect changes.
