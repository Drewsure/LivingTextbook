# ADR 0312: AI Generated Package Release Candidate Storage Contract

Date: 2026-07-31

## Status

Accepted.

## Context

The AI teaching game generator now shows a review-only generated package release candidate preview. That preview explains how generated package evidence would eventually hand off to a private tenant library and normal release-control workflow.

Without a durable contract, future hosted or local backend work could treat the preview as permission to create tenant library items, release candidates, assignments, local bundles, or student-facing routes too early.

## Decision

Add `ai_generated_package_release_candidate` to the backend schema, migration candidate list, migration specs, durable record categories, persistence boundaries, and hosted/local adapter plans.

The record must preserve generated manifest, promotion checklist, publish readiness, private library target, future tenant library item, future package release candidate, release-control, approval, and assignment rollout references.

It must block generated package library publish, release candidate writes, tenant library item writes, student-facing release, assignment writes, local bundle release, student-ready markers, and support-language-only release.

## Consequences

- Hosted and closed local deployments share one generated-package handoff model.
- AI-generated package candidates remain evidence records until private library and release-control gates pass.
- MiniStar keeps Japanese support-language release blocked while English remains the target-language trigger.
- Future library and release work can use a clear contract instead of inventing publish shortcuts.
