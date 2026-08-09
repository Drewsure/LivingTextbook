# ADR 0360: AI Generated Package Writer Rollback Drill

Date: 2026-08-09

## Status

Accepted

## Context

Generated package writer preflights now name future write targets, including rollback map work. Before any package writer implementation exists, reviewers need to see how a future writer would prove reversibility.

## Decision

Add review-only AI generated package writer rollback drills to tenant generator routes.

The drill names pre-write snapshots, post-write verification, and rollback rehearsal steps for package JSON, route registry, media playlist, local companion, assignment shell, and release-control scope. It blocks rollback execution, writer execution, production QR redirect mutation, assignment mutation, learner-data mutation, and support-language-only rollback evidence.

## Consequences

- Future package writer planning must prove restore evidence before implementation.
- White-label tenants can review rollback scope before any live publish path exists.
- No package, route, playlist, local bundle, assignment, or rollback record is written by this preview.
