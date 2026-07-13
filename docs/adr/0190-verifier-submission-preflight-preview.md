# ADR 0190: Verifier Submission Preflight Preview

Date: 2026-07-13

## Status

Accepted

## Context

Teacher draft review has handoff, decision, evidence, and audit previews. The next risk is premature verifier submission from a draft queue before schema, audio, support-language, route, evidence, and approval requirements are visible.

## Decision

Add a preview-only verifier submission preflight to `/teacher/review`.

The preflight shows schema readiness, audio regeneration blockers, support-language boundaries, route compatibility, and evidence blockers. It keeps automatic verifier submission disabled.

## Consequences

Future verifier workflow work must satisfy the preflight before draft state can move. The foundation UI can explain what a verifier would check without enabling submission, package approval, publishing, or student assignment.
