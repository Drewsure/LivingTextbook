# ADR 0311: AI Generated Package Release Candidate Preview

Date: 2026-07-31

## Status

Accepted.

## Context

The AI teaching game generator can now show generated package manifests, promotion checklists, publish readiness gates, and durable storage contracts for those review records. Partners also need to understand where a generated package would eventually go after review.

For a white-label product, that destination should be a private tenant library and the normal release-control pipeline, not a direct publish action from the AI generator route.

## Decision

Add a review-only AI generated package release candidate preview to teacher generator routes. The preview must join the generated manifest, promotion checklist, publish readiness gate, future `package_release_candidate`, future `tenant_library_item`, private library target, and student-facing release blockers into one handoff surface.

The preview cannot write release candidate records, tenant library items, route registry entries, playlists, assignments, local bundles, or student-ready markers.

MiniStar previews must keep Japanese support-language release blocked while English remains the target-language trigger.

## Consequences

- Partners can see the saleable AI generator handoff without a premature publish workflow.
- Future private tenant library work has a clearer generated-package source path.
- AI-generated package review stays aligned with the same release-control discipline as teacher-authored packages.
- The UI gains another foundation panel, but it reduces ambiguity before live generation, library, and release work begins.
