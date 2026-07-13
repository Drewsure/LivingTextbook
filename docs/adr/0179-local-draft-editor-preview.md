# ADR 0179: Local Draft Editor Preview

Date: 2026-07-13

## Status

Accepted

## Context

Teacher authoring should eventually feel fast, but live saving, review submission, audio regeneration, and student assignment require persistence, verifier workflow, rights, route, and approval gates.

## Decision

Add a local-only draft editor preview to `/teacher/authoring/draft-sample-publisher-l1-u1`.

The preview validates draft shape in the browser and keeps save, submit-for-review, student assignment, and audio regeneration blocked.

## Consequences

The product now shows the direction of teacher editing without implying a live editor or bypassing review-before-assignment rules.
